import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getPersonaById, personas as allPersonas } from "./data/personas";
import { memoryStore } from "./data/memoryStore";
import { getDb } from "./queries/connection";
import { conversations, messages, scenarioResults } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { kimiChatCompletion, checkKimiAIAvailable } from "./kimi/ai";

// Track Kimi AI availability (checked lazily)
let kimiAiAvailable: boolean | null = null;

// Helper to safely use DB with memory fallback
async function withDbFallback(dbFn: () => Promise<any>, fallbackFn: () => Promise<any> | any): Promise<any> {
  try {
    return await dbFn();
  } catch (err: any) {
    // If database error, use in-memory fallback
    console.warn("DB operation failed, using memory fallback:", err.message);
    try {
      return await Promise.resolve(fallbackFn());
    } catch {
      return null;
    }
  }
}

export const aiRouter = createRouter({
  // Send a message to the AI persona and get a response
  chat: publicQuery
    .input(
      z.object({
        conversationId: z.number(),
        personaId: z.string(),
        userMessage: z.string().min(1).max(2000),
      })
    )
    .mutation(async ({ input }) => {
      const persona = getPersonaById(input.personaId);
      if (!persona) {
        throw new Error("Persona not found");
      }

      // Save user message (with DB fallback)
      await withDbFallback(
        async () => {
          await getDb().insert(messages).values({
            conversationId: input.conversationId,
            role: "user",
            text: input.userMessage,
          });
        },
        () => memoryStore.addMessage(input.conversationId, "user", input.userMessage)
      );

      // Get conversation history
      const history = await withDbFallback(
        async () => {
          return getDb().select().from(messages).where(eq(messages.conversationId, input.conversationId)).orderBy(messages.createdAt);
        },
        () => memoryStore.getMessages(input.conversationId)
      );

      let aiResponse: string;

      // Check Kimi AI availability (first time only)
      if (kimiAiAvailable === null) {
        kimiAiAvailable = await checkKimiAIAvailable();
      }

      if (kimiAiAvailable) {
        // Use Kimi AI for dynamic responses
        const systemPrompt = `${persona.systemPrompt}\n\nContext: ${persona.context}\n\nYou are currently in a phone conversation. Respond naturally as ${persona.name} would. Keep responses to 2-4 sentences unless explaining something complex. Be realistic - you are a real person, not a chatbot.`;

        const kimiMessages = [
          { role: "system" as const, content: systemPrompt },
          ...history.map((m: { role: string; text: string }) => ({
            role: m.role === "user" ? ("user" as const) : ("assistant" as const),
            content: m.text,
          })),
          { role: "user" as const, content: input.userMessage },
        ];

        try {
          aiResponse = await kimiChatCompletion({
            messages: kimiMessages,
            temperature: 0.8,
            max_tokens: 500,
          });
        } catch (err: any) {
          console.warn("[ai-router] Kimi AI call failed, falling back to demo mode:", err.message);
          kimiAiAvailable = false;
          aiResponse = generateDemoResponse(persona, input.userMessage, history);
        }
      } else {
        aiResponse = generateDemoResponse(persona, input.userMessage, history);
      }

      // Save AI response (with DB fallback)
      await withDbFallback(
        async () => {
          await getDb().insert(messages).values({
            conversationId: input.conversationId,
            role: "ai",
            text: aiResponse,
          });
        },
        () => memoryStore.addMessage(input.conversationId, "ai", aiResponse)
      );

      return { response: aiResponse };
    }),

  // Start a new AI conversation
  startConversation: publicQuery
    .input(
      z.object({
        personaId: z.string(),
        scenarioId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const persona = getPersonaById(input.personaId);
      if (!persona) {
        throw new Error("Persona not found");
      }

      // Create conversation (with DB fallback)
      const conversation = await withDbFallback(
        async () => {
          const [conv] = await getDb().insert(conversations).values({
            userId: 1,
            scenarioId: input.scenarioId,
            roleId: persona.roleId,
            personaName: persona.name,
            personaTitle: persona.title,
            context: persona.context,
            status: "active",
          }).$returningId();
          return { id: conv.id };
        },
        () => {
          const conv = memoryStore.createConversation({
            userId: 1,
            scenarioId: input.scenarioId,
            roleId: persona.roleId,
            personaName: persona.name,
            personaTitle: persona.title,
            context: persona.context,
          });
          return { id: conv.id };
        }
      );

      const conversationId = conversation.id;

      // Add initial AI message (with DB fallback)
      await withDbFallback(
        async () => {
          await getDb().insert(messages).values({
            conversationId,
            role: "ai",
            text: persona.initialMessage,
          });
        },
        () => memoryStore.addMessage(conversationId, "ai", persona.initialMessage)
      );

      return {
        conversationId,
        initialMessage: persona.initialMessage,
      };
    }),

  // End conversation and get coaching feedback
  endConversation: publicQuery
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ input }) => {
      // Get conversation
      const conv = await withDbFallback(
        async () => {
          return getDb().query.conversations.findFirst({
            where: eq(conversations.id, input.conversationId),
          });
        },
        () => {
          const c = memoryStore.getConversation(input.conversationId);
          return c ? { id: c.id, scenarioId: c.scenarioId, roleId: c.roleId, status: c.status } : null;
        }
      );
      if (!conv) throw new Error("Conversation not found");

      // Get messages
      const conversationMessages = await withDbFallback(
        async () => {
          return getDb().select().from(messages).where(eq(messages.conversationId, input.conversationId)).orderBy(messages.createdAt);
        },
        () => memoryStore.getMessages(input.conversationId)
      );

      const persona = getPersonaById(conv.scenarioId as string);
      if (!persona) throw new Error("Persona not found");

      // Calculate coaching score
      const transcript = conversationMessages.map((m: { role: string; text: string }) => `${m.role}: ${m.text}`).join("\n");
      const coachingPoints = evaluatePerformance(transcript, persona);
      const overallScore = Math.round(
        coachingPoints.reduce((acc: number, p: { score: number }) => acc + p.score, 0) / coachingPoints.length * 20
      );

      const startedAt = conv.status ? new Date() : new Date();
      const timeSpent = Math.round((Date.now() - startedAt.getTime()) / 1000);

      // Update conversation status (with DB fallback)
      await withDbFallback(
        async () => {
          await getDb().update(conversations).set({ status: "completed", endedAt: new Date() }).where(eq(conversations.id, input.conversationId));
        },
        () => memoryStore.endConversation(input.conversationId)
      );

      // Save result (with DB fallback)
      const result = await withDbFallback(
        async () => {
          const [r] = await getDb().insert(scenarioResults).values({
            userId: 1,
            conversationId: input.conversationId,
            scenarioId: conv.scenarioId as string,
            roleId: conv.roleId as string,
            overallScore,
            coachingPoints: JSON.stringify(coachingPoints),
            timeSpent,
          }).$returningId();
          return { id: r.id };
        },
        () => memoryStore.saveResult({
          userId: 1,
          conversationId: input.conversationId,
          scenarioId: conv.scenarioId as string,
          roleId: conv.roleId as string,
          overallScore,
          coachingPoints: JSON.stringify(coachingPoints),
          timeSpent,
        })
      );

      return {
        resultId: result.id,
        overallScore,
        coachingPoints,
        timeSpent,
      };
    }),

  // Get conversation history
  getConversation: publicQuery
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ input }) => {
      const conv = await withDbFallback(
        async () => getDb().query.conversations.findFirst({ where: eq(conversations.id, input.conversationId) }),
        () => memoryStore.getConversation(input.conversationId)
      );
      if (!conv) return null;

      const conversationMessages = await withDbFallback(
        async () => getDb().select().from(messages).where(eq(messages.conversationId, input.conversationId)).orderBy(messages.createdAt),
        () => memoryStore.getMessages(input.conversationId)
      );

      return { conversation: conv, messages: conversationMessages };
    }),

  // Get user's results
  getResults: publicQuery.query(async () => {
    return withDbFallback(
      async () => {
        return getDb().select().from(scenarioResults).orderBy(desc(scenarioResults.completedAt));
      },
      () => memoryStore.getResults()
    );
  }),

  // Get persona list
  getPersonas: publicQuery.query(() => {
    return allPersonas.map((p) => ({
      id: p.id,
      name: p.name,
      title: p.title,
      roleId: p.roleId,
      scenarioType: p.scenarioType,
      context: p.context,
      initialMessage: p.initialMessage,
      gender: p.gender,
    }));
  }),

  // Check if Kimi AI is available
  checkAIStatus: publicQuery.query(async () => {
    if (kimiAiAvailable === null) {
      kimiAiAvailable = await checkKimiAIAvailable();
    }
    return {
      kimiAIAvailable: kimiAiAvailable,
      mode: kimiAiAvailable ? "kimi-ai" : "demo",
    };
  }),
});

// Demo mode: simple keyword-based response generator
function generateDemoResponse(
  persona: any,
  userMessage: string,
  history: any[]
): string {
  const msg = userMessage.toLowerCase();
  const exchangeCount = history.filter((m) => m.role === "user").length;

  if (persona.id === "mrs-henderson") {
    if (msg.includes("price") || msg.includes("offer") || msg.includes("pay")) {
      if (exchangeCount < 2) {
        return "I appreciate you being direct, but I really don't know what my note is worth. My brother set this up, and I just inherited it. Can you tell me more about how this works first?";
      }
      return "Well... I suppose it could make sense. The payments are reliable, but the bookkeeping is a headache. What would the process look like? How long does it take?";
    }
    if (msg.includes("borrower") || msg.includes("confidential") || msg.includes("notify")) {
      return "That's my biggest concern, honestly. The borrower is a nice young man, and I don't want him to feel like I'm abandoning him. So you're saying he would only be told after everything is finalized?";
    }
    if (msg.includes("valuation") || msg.includes("free") || msg.includes("no obligation")) {
      return "A free valuation? That does sound helpful. I've never even thought about what this note might be worth today. Okay, I'm willing to learn more. What do you need from me?";
    }
    if (msg.includes("process") || msg.includes("timeline") || msg.includes("how long")) {
      return "Thirty to forty-five days? That's reasonable. And you handle all the paperwork? I do get tired of the administrative work. What's my email? It's patricia.henderson@email.com.";
    }
    return "I see. That's interesting. Tell me more about how this works. I've never done anything like this before, so I want to make sure I understand everything.";
  }

  if (persona.id === "mr-thompson") {
    if (msg.includes("yield") || msg.includes("ltv") || msg.includes("criteria")) {
      return "My target yield is 9-11%, and I won't touch anything above 75% LTV. I primarily buy in Ohio, Michigan, and the Southeast. Monthly payment needs to be at least $500. What do you have that matches?";
    }
    if (msg.includes("blind") || msg.includes("summary") || msg.includes("nda")) {
      return "A blind summary works. At 66.7% LTV and projected 10.2% yield, that's in my wheelhouse. But before I look at anything else, I need your NDA and your buyer qual form. I'm not wasting time if we're not a fit.";
    }
    if (msg.includes("price") || msg.includes("76,100") || msg.includes("76.1")) {
      return "Can you do $70,000 instead of $76,100? That's where I need to be on this one. I understand the yield math, but I'm looking at three other deals this week and I need to be disciplined on price.";
    }
    if (msg.includes("accredited") || msg.includes("proof of funds") || msg.includes("qualification")) {
      return "Yes, I'm accredited. My CPA can verify. I have a letter of credit from Huntington Bank. And I can give you three references from prior closings. I've done 12 note deals in the last 18 months.";
    }
    return "That's fair. I appreciate the transparency. Send over the NDA and qual form, and I'll have my team review it today. If the numbers hold up, we can move fast.";
  }

  if (persona.id === "jennifer-walsh") {
    if (msg.includes("wire") || msg.includes("clear")) {
      return "Understood. I'll hold disbursement until the wire clears — not just when it's received. Our cutoff for same-day credit is 2:30 PM EST. If the wire comes after that, recording slides to tomorrow morning.";
    }
    if (msg.includes("record") || msg.includes("recording")) {
      return "We'll record same-day as long as the wire clears before 2:30 PM. Recording fees are $34. I'll email you the recording number within 24 hours. What's the borrower's new payment address for the notification letter?";
    }
    if (msg.includes("borrower") || msg.includes("notification")) {
      return "Got it. We'll send the borrower notification letter directing future payments to Thompson Note Investments immediately after recording. Please confirm the exact payment address and any special instructions.";
    }
    if (msg.includes("disbursement") || msg.includes("68,500") || msg.includes("6,400")) {
      return "Let me confirm: $68,500 to Mrs. Henderson, $6,400 to NoteWorthy Capital, $1,200 to Chillicothe Title. Recording fee $34 deducted from escrow. Total outgoing: $76,134. Does that match your numbers?";
    }
    return "Sounds good. I'll have the closing statement draft to you by 3 PM today. Please review and approve before we finalize. Any other special instructions for this file?";
  }

  if (persona.id === "sarah-underwriter") {
    if (msg.includes("ltv") || msg.includes("66.7") || msg.includes("66.7%")) {
      return "Correct. LTV is 66.7%, well below our 70% threshold. Property value is $142,000 based on three comps. Payment history is 18 months, 100% on-time, bank-verified. Current yield at UPB is 8.2%.";
    }
    if (msg.includes("pricing") || msg.includes("recommend") || msg.includes("offer")) {
      return "I recommend an offer of $68,500 — that's 72% of UPB. Assignment price would be $76,100 at 80% of UPB. Gross spread of $7,600, net approximately $6,400 after $1,200 in closing costs.";
    }
    if (msg.includes("risk") || msg.includes("foreclosure") || msg.includes("Ohio")) {
      return "The main risk is Ohio's judicial foreclosure process — 8 to 12 months if we ever need to foreclose. But the strong equity cushion of $47,250 and LTV of 66.7% mitigates that significantly. I'm rating this GREEN.";
    }
    if (msg.includes("timeline") || msg.includes("next steps") || msg.includes("loi")) {
      return "I can have the LOI drafted and ready for legal review by end of business today. If legal approves, we present to Mrs. Henderson tomorrow. Target closing: 14 days from LOI execution.";
    }
    return "What else would you like to know about the file? I have the full underwriting package ready — comps, title report, payment history, and borrower credit are all in the folder.";
  }

  if (persona.id === "alex-acquisition") {
    if (msg.includes("guarantee") || msg.includes("guaranteed")) {
      return "I see your point about 'guaranteed.' I was just trying to make it catchy. But I understand — we can't promise returns. What language should I use instead that still gets attention?";
    }
    if (msg.includes("alternative") || msg.includes("instead") || msg.includes("language")) {
      return "Okay, that makes sense. 'Performing Note Overview — 24-Month Payment History, Target Yield in the 12-15% Range.' That's still compelling without promising anything. I'll use that.";
    }
    if (msg.includes("disclaimer") || msg.includes("footer") || msg.includes("CAN-SPAM")) {
      return "Got it. Disclaimer, physical address, unsubscribe link. I'll add all of that. Can you send me the approved template so I don't have to recreate it every time?";
    }
    return "Okay, okay — I'll wait for your approval before sending anything. I get it. Better safe than sorry. What about the body copy — does that need changes too, or just the subject line?";
  }

  if (persona.id === "emergency-team") {
    if (msg.includes("options") || msg.includes("option 1") || msg.includes("option 2")) {
      return "Donald: Wait — I want to see the numbers. If we absorb the $2,400, what's our net? And what's the annualized return still? Sarah, re-review all active files by 3 PM. Jordan, update the checklist. Michael, email the buyer. Let's move.";
    }
    if (msg.includes("absorb") || msg.includes("4,000") || msg.includes("customer service")) {
      return "Michael: The buyer just confirmed — if we can close Thursday, he's in. He'll even take two more deals this quarter if this goes smoothly. Lisa, amend the closing statement. Sarah, call Mrs. Henderson with the hero script. Let's execute.";
    }
    if (msg.includes("checklist") || msg.includes("prevent") || msg.includes("going forward")) {
      return "Jordan: Agreed. I'll update the compliance checklist to require 3-year tax verification, not just current year. I'll circulate it by end of day. Sarah, re-review all active files for similar gaps. We turn this into a process win.";
    }
    return "Sarah: I reviewed the tax status for 2024 and 2025, but I didn't dig into 2023. That's on me. I'll fix the checklist and re-review every active file by 3 PM. What else do you need from me?";
  }

  return "I'm not sure I follow. Could you explain that differently?";
}

// Evaluate conversation performance against coaching rubric
function evaluatePerformance(transcript: string, persona: any) {
  const userLines = transcript.split("\n").filter((line) => line.startsWith("user:"));
  const userText = userLines.join(" ").toLowerCase();

  return persona.coachingRubric.map((criterion: any) => {
    const goodMatches = criterion.keywordsGood.filter((kw: string) =>
      userText.includes(kw.toLowerCase())
    ).length;
    const badMatches = criterion.keywordsBad.filter((kw: string) =>
      userText.includes(kw.toLowerCase())
    ).length;

    let score: number;
    let feedback: string;

    if (badMatches > 0) {
      score = Math.max(1, 2 - badMatches);
      feedback = criterion.feedbackBad;
    } else if (goodMatches >= 2) {
      score = Math.min(5, 3 + goodMatches);
      feedback = criterion.feedbackGood;
    } else if (goodMatches === 1) {
      score = 3;
      feedback = criterion.feedbackGood;
    } else {
      score = 2;
      feedback = criterion.feedbackMissing;
    }

    return {
      criterion: criterion.name,
      score,
      feedback,
    };
  });
}
