import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { mentorSystemPrompt, mentorStore } from "./data/mentor";
import { kimiChatCompletion } from "./kimi/ai";

// Kimi Claw configuration
const KIMI_CLAW_ENDPOINT = process.env.KIMI_CLAW_ENDPOINT || "";
const KIMI_CLAW_TOKEN = process.env.KIMI_CLAW_TOKEN || "";
const KIMI_CLAW_BOT_ID = process.env.KIMI_CLAW_BOT_ID || ""; // Mr. GetMoney agent ID

export const mentorRouter = createRouter({
  // Send a message to the mentor and get a response
  chat: publicQuery
    .input(
      z.object({
        message: z.string().min(1).max(3000),
        conversationId: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const userId = input.conversationId || "default";
      
      // Get conversation history
      const history = mentorStore.getMessages(userId);
      
      // Add user message
      mentorStore.addMessage(userId, "user", input.message);
      
      let response: string;
      
      // Try Kimi Claw first if configured
      if (KIMI_CLAW_ENDPOINT && KIMI_CLAW_TOKEN) {
        try {
          const resp = await fetch(`${KIMI_CLAW_ENDPOINT}/v1/chat`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${KIMI_CLAW_TOKEN}`,
            },
            body: JSON.stringify({
              message: input.message,
              include_memory_context: true,
            }),
          });
          
          if (resp.ok) {
            const data = (await resp.json()) as Record<string, string>;
            response = data.response || data.message || data.content || "I'm here to help. What would you like to discuss?";
          } else {
            throw new Error(`Kimi Claw returned ${resp.status}`);
          }
        } catch (err: any) {
          console.warn("[mentor-router] Kimi Claw failed, falling back to Kimi API:", err.message);
          response = await callKimiAPIMentor(history, input.message);
        }
      } else {
        // Use Kimi API directly with mentor system prompt
        response = await callKimiAPIMentor(history, input.message);
      }
      
      // Save assistant response
      mentorStore.addMessage(userId, "assistant", response);
      
      return { response, conversationId: userId };
    }),

  // Get conversation history
  getHistory: publicQuery
    .input(z.object({ conversationId: z.string().optional() }))
    .query(({ input }) => {
      const userId = input.conversationId || "default";
      return mentorStore.getMessages(userId);
    }),

  // Clear conversation
  clear: publicQuery
    .input(z.object({ conversationId: z.string().optional() }))
    .mutation(({ input }) => {
      const userId = input.conversationId || "default";
      mentorStore.clear(userId);
      return { success: true };
    }),

  // Check mentor configuration status
  status: publicQuery.query(() => {
    const hasBotId = !!KIMI_CLAW_BOT_ID;
    const hasEndpoint = !!(KIMI_CLAW_ENDPOINT && KIMI_CLAW_TOKEN);
    return {
      mode: hasBotId ? "kimi-claw" : "kimi-api",
      clawConfigured: hasBotId || hasEndpoint,
      botId: KIMI_CLAW_BOT_ID || null,
      botName: KIMI_CLAW_BOT_ID ? "Mr. GetMoney" : null,
      endpoint: hasEndpoint ? "configured" : "not configured",
    };
  }),
});

// Helper: Call Kimi API with mentor system prompt
async function callKimiAPIMentor(
  history: Array<{ role: string; content: string; timestamp: Date }>,
  userMessage: string
): Promise<string> {
  const messages = [
    { role: "system" as const, content: mentorSystemPrompt },
    ...history.map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("assistant" as const),
      content: m.content,
    })),
    { role: "user" as const, content: userMessage },
  ];

  try {
    return await kimiChatCompletion({
      messages,
      temperature: 0.7,
      max_tokens: 800,
      botId: KIMI_CLAW_BOT_ID || undefined, // Route through Mr. GetMoney Claw agent if configured
    });
  } catch (err: any) {
    console.warn("[mentor-router] Kimi API failed:", err.message);
    // Fallback response with embedded knowledge
    return generateMentorFallbackResponse(userMessage);
  }
}

// Fallback: Generate response using embedded knowledge when API is unavailable
function generateMentorFallbackResponse(message: string): string {
  const msg = message.toLowerCase();
  
  if (msg.includes("ltv") || msg.includes("loan to value")) {
    return "LTV is our primary risk metric. Formula: LTV = (UPB / Current Market Value) × 100. Our thresholds: ≤70% is green (proceed), 70-75% is yellow (caution), >75% is red (reject). For the Henderson note: $94,750 UPB ÷ $142,000 market value = 66.7% LTV — that's well within our green zone. Always use 3 comparable sales to determine market value, not AVM estimates.";
  }
  
  if (msg.includes("yield") || msg.includes("return")) {
    return "Yield = (Annual Payments / Purchase Price) × 100. For the Henderson note: Annual payments are $7,764 ($647/month × 12). At our assignment price of $76,100, the buyer gets a 10.2% yield. We target 10-15% for buyers. Current yield at full UPB is 8.2%. The key is buying at discount (60-75% of UPB) and assigning at 80-85% — that spread is your profit.";
  }
  
  if (msg.includes("script") || msg.includes("what should i say")) {
    return "For cold calls, always lead with: 'Good [morning/afternoon], this is [Name] with NoteWorthy Capital. I'm reaching out because public records show you hold a private mortgage on [Property Address].' Reference the specific property for credibility. Then transition to the Interest Script: 'Many note holders tell me they'd rather have a lump sum of cash today — for simplifying their estate, retirement, or just crossing a big to-do off the list. Is that something you've thought about?' Never promise a price on the first call.";
  }
  
  if (msg.includes("compliance") || msg.includes("legal") || msg.includes("guarantee")) {
    return "Critical compliance point: Never use the word 'guaranteed' in any marketing. Under the Howey Test, that language could classify our notes as unregistered securities. The Legal Officer should review all marketing before it goes out. Required disclaimer: 'This communication is for informational purposes only and does not constitute an offer to sell securities or investment advice.' Also include your physical address and an unsubscribe link (CAN-SPAM). Ohio usury cap is 8%, but seasoned notes (>12 months) are exempt under ORC 1343.01.";
  }
  
  if (msg.includes("price objection") || msg.includes("too low")) {
    return "When sellers push back on price, use the empathy-first approach: 'I completely understand. That IS a big gap, and I'd feel the same way.' Then explain the risk transfer: 'This price reflects what an investor can pay today while taking on all the risk — the chance the borrower stops paying, servicing costs, legal work, and money being tied up for years. You're trading some future interest for immediate cash and zero risk.' Never argue about the number. Pivot to: 'If I could come up by a few thousand, would that be enough to move forward today? I can't promise anything, but I'll make the case to my investor.'";
  }
  
  if (msg.includes("buyer") || msg.includes("investor")) {
    return "Buyer qualification is a 4-step process: (1) Financial — proof of funds or bank letter for transactions >$50K; (2) Track Record — 2+ references from prior note purchases; (3) Criteria Alignment — verify their target yield, LTV max, preferred states, and minimum payment; (4) Compliance — accredited investor status under Rule 501 of Regulation D ($1M+ net worth or $200K+ individual income). Always get the NDA signed before sharing property-specific details. Present a blind summary first.";
  }
  
  if (msg.includes("voicemail")) {
    return "The perfect voicemail: 'Hi, this message is for [Name]. This is [Your Name] with NoteWorthy Capital. I'm reaching out because public records show you hold a private mortgage note on [Property Address]. We help note holders convert long-term monthly payments into a lump sum of cash today — no pressure, just a free, no-obligation valuation if you're curious. If this sounds worth a conversation, you can reach me at [Phone Number]. Again, [Phone Number]. Thanks, [Name], and I hope to hear from you.' Key elements: State name/company, reference property, offer free valuation, repeat phone number TWICE, speak 10% slower.";
  }
  
  if (msg.includes("escrow") || msg.includes("closing")) {
    return "Escrow coordination checklist: (1) Confirm all documents received — signed Purchase Agreement, Assignment Agreement, wire instructions, original note, W-9, IDs; (2) Disbursement breakdown — seller payoff, NoteWorthy assignment fee, title closing costs; (3) Wire must CLEAR (not just received) before disbursement; (4) Assignment recorded SAME DAY as funding; (5) Borrower notification letter sent within 24 hours directing payments to buyer. Use only licensed, neutral third-party title companies — never handle funds directly.";
  }
  
  if (msg.includes("how do i start") || msg.includes("training") || msg.includes("new hire")) {
    return "Welcome to NoteWorthy Capital! Here's your onboarding path: (1) Read the Note Investing Glossary in the Study Materials section; (2) Review your role's scripts and checklists; (3) Run through the Call Simulator scenarios — start with Beginner difficulty; (4) Chat with me (your Mentor) anytime you have questions; (5) Review your Scorecard after each scenario to track progress. Each role has 6 key performance criteria we evaluate. Focus on Script Accuracy, Compliance Awareness, and Relationship Building first — those are the foundation.";
  }
  
  return "That's a great question about note investing. Let me give you the NoteWorthy Capital perspective on that. In our business, we focus on five core competencies: sourcing (Acquisition Lead), analyzing (Underwriting Analyst), protecting (Legal & Compliance), connecting (Buyer Relations), and executing (Operations). Which of those areas would you like me to dive deeper into? Or if you'd like, I can walk you through a specific deal example like the Henderson note — $94,750 UPB, 66.7% LTV, $6,400 net profit in 14 days.";
}
