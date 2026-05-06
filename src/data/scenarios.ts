import type { Scenario } from '@/types';

export const scenarios: Scenario[] = [
  // ===== ACQUISITION LEAD =====
  {
    id: 'al-cold-call',
    roleId: 'acquisition',
    title: 'Cold Call to Note Holder',
    description: 'Live answer cold call to Mrs. Henderson, an inherited note holder. Build rapport, qualify motivation, and gather key data points.',
    difficulty: 'Beginner',
    type: 'phone',
    context: 'Mrs. Henderson, 68, inherited a private mortgage note from her brother. She has been receiving $650/month payments for 18 months but finds the administrative burden tedious. She lives in Chillicothe, Ohio.',
    personaName: 'Mrs. Henderson',
    personaTitle: 'Note Holder',
    steps: [
      {
        id: 'al-cc-1',
        aiText: "Hello?",
        expectedResponseHints: ['introduce yourself', 'company name', 'purpose of call'],
        coachingNotes: 'Always state your name and company clearly within the first 5 seconds. Reference the specific property to establish credibility.',
        waitForUser: true
      },
      {
        id: 'al-cc-2',
        aiText: "Well, I suppose. I've been getting these calls. Are you going to try to sell me something?",
        expectedResponseHints: ['no pressure', 'free valuation', 'no obligation', 'information only'],
        coachingNotes: 'Address the skepticism directly. Emphasize NO obligation and NO cost. Position the valuation as educational, not salesy.',
        waitForUser: true
      },
      {
        id: 'al-cc-3',
        aiText: "I appreciate the honesty. Yes, I do have that note. My brother carried the financing when he sold the house two years ago. Now I'm stuck collecting payments.",
        expectedResponseHints: ['empathy', 'understand', 'common situation', 'validate feelings'],
        coachingNotes: 'Show empathy - acknowledge the administrative burden. Do NOT rush to price. Validate her frustration.',
        waitForUser: true
      },
      {
        id: 'al-cc-4',
        aiText: "I think around $95,000, but I'd have to check my statements.",
        expectedResponseHints: ['great', 'perfect', 'verify later', 'interest rate', 'payment history'],
        coachingNotes: 'Move efficiently through the 5 qualifying data points: UPB, interest rate, payment amount, payment status, note age.',
        waitForUser: true
      },
      {
        id: 'al-cc-5',
        aiText: "Well, I worry about the borrower finding out I'm selling. Will they be notified?",
        expectedResponseHints: ['confidential', 'not notified', 'after closing', 'discretion', 'professional'],
        coachingNotes: 'Address confidentiality concerns directly. Reassure that borrower is only notified AFTER sale closes. Emphasize discretion.',
        waitForUser: true
      },
      {
        id: 'al-cc-6',
        aiText: "That's reassuring. Okay, I'm willing to learn more. What happens next?",
        expectedResponseHints: ['email', 'information request', 'follow up tomorrow', 'direct number', '5-7 business days'],
        coachingNotes: 'Set clear next steps: send information request form, follow up timeline, and provide your direct contact info.',
        waitForUser: true
      }
    ],
    keyPerformanceElements: [
      'Transparency - Clear about no pressure, no obligation',
      'Empathy - Acknowledges seller concerns about administrative burden',
      'Qualification - Efficiently gathers UPB, interest rate, payment history',
      'Value Proposition - Positions free valuation as educational',
      'Objection Handling - Addresses confidentiality concern professionally',
      'Clear Next Steps - Sets expectations for timeline and follow-up',
      'Compliance - Never promises specific price or guarantees outcome'
    ]
  },
  {
    id: 'al-voicemail',
    roleId: 'acquisition',
    title: 'The Perfect Voicemail',
    description: 'Leave a compelling voicemail for Mr. Patterson that gets a callback.',
    difficulty: 'Beginner',
    type: 'phone',
    context: 'Mr. Patterson holds a private mortgage note on Cherry Lane. He has received a direct-mail letter 5 days ago. This is the first follow-up call. The line goes to voicemail.',
    personaName: 'Voicemail System',
    personaTitle: 'Automated',
    steps: [
      {
        id: 'al-vm-1',
        aiText: "You have reached the voicemail of Robert Patterson. Please leave a message after the tone. *BEEP*",
        expectedResponseHints: ['name', 'company', 'public records', 'note', 'free valuation', 'no obligation', 'phone number twice'],
        coachingNotes: 'The perfect voicemail: State name/company, reference property specifically, offer free no-obligation valuation, repeat phone number TWICE, speak 10% slower than normal.',
        waitForUser: true
      }
    ],
    keyPerformanceElements: [
      'Warmth & pace - Relaxed, 10% slower than normal, audible smile',
      'Credibility - References public records and specific property',
      'Benefit language - Convert payments into lump sum',
      'Call to action - Free, no-obligation valuation + number repeated twice',
      'Compliance - No promises of price, no pressure'
    ]
  },
  {
    id: 'al-objection',
    roleId: 'acquisition',
    title: 'Handling Price Objection',
    description: 'The seller pushes back on your preliminary offer range. Handle it professionally and ethically.',
    difficulty: 'Advanced',
    type: 'phone',
    context: 'You have presented a preliminary offer range of $62,000-$67,000 on a $100,000 UPB note to James Whitfield. He is disappointed and pushing back.',
    personaName: 'James Whitfield',
    personaTitle: 'Note Holder',
    steps: [
      {
        id: 'al-ob-1',
        aiText: "That's not even close to the balance. Why would I take less than I'm owed?",
        expectedResponseHints: ['understand', 'empathy', 'risk transfer', 'investor takes risk', 'immediate cash', 'no risk'],
        coachingNotes: 'Empathize FIRST before explaining. Use the "risk transfer" value proposition - the investor absorbs default risk, servicing burden, and time value.',
        waitForUser: true
      },
      {
        id: 'al-ob-2',
        aiText: "I suppose. But I still think it's low. Can you do any better?",
        expectedResponseHints: ['might improve', 'go back to investor', 'if move forward today', 'cannot promise', 'willing to ask'],
        coachingNotes: 'Pivot to "what if I can improve?" WITHOUT making a promise. Create forward momentum. Ask if they would move forward at a higher number.',
        waitForUser: true
      }
    ],
    keyPerformanceElements: [
      'Empathized before explaining',
      'Used risk transfer justification (core value proposition)',
      'Avoided arguing about the number',
      'Pivoted to "what if I can improve?" without making a promise',
      'Maintained calm, respectful tone'
    ]
  },
  // ===== UNDERWRITING ANALYST =====
  {
    id: 'ua-deal-review',
    roleId: 'underwriting',
    title: 'Internal Deal Review Presentation',
    description: 'Present the Henderson note analysis to the team for LOI approval decision.',
    difficulty: 'Intermediate',
    type: 'meeting',
    context: 'You have completed due diligence on the Henderson note. The Acquisition Lead has qualified the seller. Now you present findings to the team before proceeding to LOI.',
    personaName: 'Team Meeting',
    personaTitle: 'Internal Review',
    steps: [
      {
        id: 'ua-dr-1',
        aiText: "Good morning. Let's hear the analysis on the Henderson note. What's the verdict?",
        expectedResponseHints: ['LTV', 'property value', '$142,000', '66.7%', 'below 70%', 'payment history', '100% on-time'],
        coachingNotes: 'Lead with the key metrics: LTV (66.7%, well below 70% threshold), property value ($142K based on 3 comps), payment history (100% on-time, 18 months).',
        waitForUser: true
      },
      {
        id: 'ua-dr-2',
        aiText: "What's the pricing recommendation? Can we make money on this?",
        expectedResponseHints: ['offer $68,500', '72% of UPB', 'assignment $76,100', '80% of UPB', 'gross spread $7,600', 'net profit $6,400'],
        coachingNotes: 'Present clear pricing: Recommended offer $68,500 (72% UPB), assignment price $76,100 (80% UPB), gross spread $7,600, net profit ~$6,400 after closing costs.',
        waitForUser: true
      },
      {
        id: 'ua-dr-3',
        aiText: "Any risks we should be aware of?",
        expectedResponseHints: ['Ohio', 'judicial foreclosure', '8-12 months', 'equity cushion', 'strong LTV', 'mitigates risk'],
        coachingNotes: 'Flag the judicial foreclosure risk in Ohio (8-12 month timeline) but explain how the strong equity cushion ($47,250) and conservative LTV mitigate this risk.',
        waitForUser: true
      }
    ],
    keyPerformanceElements: [
      'Data-Driven - Presents hard numbers, not opinions',
      'Risk-Aware - Identifies judicial foreclosure risk but mitigates with LTV',
      'Collaborative - Seeks team input on pricing strategy',
      'Efficient - Clear timeline and action items',
      'Compliance-First - Flags usury law exemption',
      'Profit-Focused - Calculates exact spread and net profit',
      'Professional - Structured presentation'
    ]
  },
  {
    id: 'ua-explain-yield',
    roleId: 'underwriting',
    title: "Explaining the Offer to a Seller",
    description: 'A seller calls asking why the offer is lower than their UPB. Explain the valuation clearly.',
    difficulty: 'Intermediate',
    type: 'phone',
    context: 'Mr. Patterson received the written LOI for $65,000. His UPB is $85,000. He is calling to understand the discount.',
    personaName: 'Mr. Patterson',
    personaTitle: 'Note Holder',
    steps: [
      {
        id: 'ua-ey-1',
        aiText: "Your offer says $65,000. The balance is $85,000. Why such a big discount?",
        expectedResponseHints: ['investor yield', 'risk', 'interest rate', 'equity', 'market rate', 'similar range', 'walk through calculation'],
        coachingNotes: 'Explain pricing simply: investor needs target yield for risk. The discount compensates for risk of borrower stopping payments, servicing costs, and money being tied up.',
        waitForUser: true
      },
      {
        id: 'ua-ey-2',
        aiText: "But couldn't I get more if I just kept it?",
        expectedResponseHints: ['yes over time', 'full balance plus interest', 'carry all risk', 'job loss', 'value drop', 'certainty', 'lump sum', 'no worry'],
        coachingNotes: 'Acknowledge they COULD get more over time - do NOT argue. Pivot to risk transfer: "You absolutely could, but you carry all the risk. We offer certainty."',
        waitForUser: true
      }
    ],
    keyPerformanceElements: [
      'Avoided giving tax or legal advice',
      'Explained the risk transfer concept simply',
      'Stayed calm and factual, not defensive',
      'Offered to walk through the math without being condescending'
    ]
  },
  // ===== LEGAL & COMPLIANCE =====
  {
    id: 'lo-contract-review',
    roleId: 'legal',
    title: 'Contract Review & Securities Analysis',
    description: 'Review the Henderson LOI for compliance issues before execution.',
    difficulty: 'Intermediate',
    type: 'meeting',
    context: 'The Underwriting Analyst has drafted an LOI for the Henderson note. You must review it for securities law compliance, state law, and contract language issues.',
    personaName: 'Sarah (Underwriting)',
    personaTitle: 'Underwriting Analyst',
    steps: [
      {
        id: 'lo-cr-1',
        aiText: "I've drafted the LOI for the Henderson note. Can you review it for compliance before we send it to the seller?",
        expectedResponseHints: ['Howey Test', 'not a security', 'accredited investor', 'Rule 501', 'conservative'],
        coachingNotes: 'Apply the Howey Test. Since this is a performing note with on-time payments, not pooled/securitized, and a one-off assignment, it likely does NOT constitute a security. But be conservative - require accredited investor representation.',
        waitForUser: true
      },
      {
        id: 'lo-cr-2',
        aiText: "Here's the LOI draft. I used standard language from our template.",
        expectedResponseHints: ['Section 2(c)', 'guarantee', 'cannot guarantee', 'represents', 'no guarantee of future payments'],
        coachingNotes: 'Flag ANY "guarantee" language. Change "Seller guarantees payments will continue" to "Seller represents payment history as accurate. No guarantee of future payments is made." This is CRITICAL for liability protection.',
        waitForUser: true
      },
      {
        id: 'lo-cr-3',
        aiText: "Good catch. Anything else I need to know about Ohio compliance?",
        expectedResponseHints: ['Ohio usury', '8%', 'ORC 1343.01', 'seasoned note', '12 months', 'exempt', 'licensing'],
        coachingNotes: 'Cite Ohio Revised Code 1343.01: usury cap is 8% for consumer loans, BUT seasoned notes over 12 months old are exempt. This note is 18 months old, so we are exempt.',
        waitForUser: true
      }
    ],
    keyPerformanceElements: [
      'Regulatory Expertise - Cites specific statutes (Ohio Rev. Code 1343.01)',
      'Risk Mitigation - Removes guarantee language to prevent liability',
      'Educational - Explains the why behind compliance requirements',
      'Efficient - Provides clear approval with specific action items',
      'Documentation - References specific contract sections'
    ]
  },
  {
    id: 'lo-nda-standoff',
    roleId: 'legal',
    title: 'Holding the Line on NDA Policy',
    description: 'Coach the Buyer Relations Manager when a buyer refuses to sign the NDA before receiving deal details.',
    difficulty: 'Advanced',
    type: 'meeting',
    context: 'A large institutional buyer wants to see the full underwriting package BEFORE signing the NDA. The Buyer Relations Manager is tempted to accommodate them.',
    personaName: 'Morgan (Buyer Relations)',
    personaTitle: 'Buyer Relations Manager',
    steps: [
      {
        id: 'lo-nd-1',
        aiText: "This fund says they'll move faster if we just send the package first. They're a big institution - low risk, right?",
        expectedResponseHints: ['non-negotiable', 'NDA protects', 'seller identity', 'proprietary', 'even institutions', 'go around us'],
        coachingNotes: 'Hold FIRM on the policy. The NDA is non-negotiable. It protects seller identity AND proprietary underwriting work. Even big institutions could go around us or share the property address.',
        waitForUser: true
      },
      {
        id: 'lo-nd-2',
        aiText: "But what if we lose the deal? They're serious buyers.",
        expectedResponseHints: ['DocuSign', '5 minutes', 'red flag', 'serious buyer will sign', 'blind teaser', 'keep momentum'],
        coachingNotes: 'Offer solutions to keep momentum: DocuSign takes 5 minutes, blind teaser can go out without NDA, and if they push back that is a RED flag about their processes.',
        waitForUser: true
      }
    ],
    keyPerformanceElements: [
      'Held firm on the policy',
      'Offered solutions (DocuSign, blind teaser) to keep deal moving',
      'Identified the red flag without accusing',
      'Took immediate action to support the manager'
    ]
  },
  // ===== BUYER RELATIONS =====
  {
    id: 'br-qualify-buyer',
    roleId: 'buyer-relations',
    title: 'Qualifying a New Buyer',
    description: 'Onboard a new investor, Mr. Thompson, using the 4-part qualification framework.',
    difficulty: 'Beginner',
    type: 'phone',
    context: 'Mr. Thompson is a new investor interested in performing notes. You need to qualify him using the 4-part framework: financial, track record, criteria alignment, and compliance.',
    personaName: 'Mr. Thompson',
    personaTitle: 'Potential Investor',
    steps: [
      {
        id: 'br-qb-1',
        aiText: "Yes, I have time. I've been looking for quality performing notes, but the market is pretty competitive right now.",
        expectedResponseHints: ['target yield', 'LTV', 'criteria', 'states', 'payment amount', 'alignment'],
        coachingNotes: 'Qualify FIRST before presenting any deal. Ask about target yield, preferred LTV, states, minimum payment threshold, and owner-occupied preference.',
        waitForUser: true
      },
      {
        id: 'br-qb-2',
        aiText: "I'm looking for 9-11% yield, LTV below 75%. Primarily Midwest and Southeast. I prefer notes with payments of at least $500/month.",
        expectedResponseHints: ['perfect alignment', ' Ohio note', 'blind summary', '66.7% LTV', '10.2% yield', 'NDA', 'proof of funds'],
        coachingNotes: 'Confirm alignment, then present a BLIND summary (no property address). Mention you are presenting to multiple buyers to create ethical urgency.',
        waitForUser: true
      },
      {
        id: 'br-qb-3',
        aiText: "That looks interesting. The yield is in my range. What's your closing timeline?",
        expectedResponseHints: ['5 business days', '14 days total', 'accredited investor', 'Rule 501', 'proof of funds', 'references'],
        coachingNotes: 'State timeline (5 business days post-DD, 14 days total). THEN verify compliance: accredited investor status, proof of funds, and references from prior purchases.',
        waitForUser: true
      }
    ],
    keyPerformanceElements: [
      'Qualification-First - Verifies buyer criteria BEFORE presenting deal',
      'Efficient - Gathers all key parameters in one call',
      'Transparent - Clear about process, timeline, and requirements',
      'Compliance-Focused - Verifies accredited investor status upfront',
      'Selective - Positions deal flow as exclusive, not desperate'
    ]
  },
  {
    id: 'br-deal-presentation',
    roleId: 'buyer-relations',
    title: 'Deal Presentation & Price Hold',
    description: 'Present the Henderson note to a qualified buyer and hold firm on pricing.',
    difficulty: 'Intermediate',
    type: 'phone',
    context: 'Thomas Blake is a pre-qualified buyer. You are presenting the Henderson note at $76,100 (80% of UPB) with a 10.2% yield.',
    personaName: 'Thomas Blake',
    personaTitle: 'Qualified Buyer',
    steps: [
      {
        id: 'br-dp-1',
        aiText: "Can you do $70,000 instead of $76,100? That's where I need to be.",
        expectedResponseHints: ['firm', 'non-negotiable', 'first look', 'next two notes', 'exclusivity', 'value add'],
        coachingNotes: 'HOLD FIRM on price. Do NOT discount. Instead, add non-cash value: offer first look on next two notes, priority deal flow, or expedited presentation.',
        waitForUser: true
      },
      {
        id: 'br-dp-2',
        aiText: "That's fair. The first look is valuable. Send the package. I'll give you an answer by noon tomorrow.",
        expectedResponseHints: ['email within 30 minutes', 'direct line', '48 hours', 'NDA confirmed', 'questions welcome'],
        coachingNotes: 'Confirm next steps clearly: send full package within 30 minutes, provide direct contact, set 48-hour review window, confirm NDA is executed.',
        waitForUser: true
      }
    ],
    keyPerformanceElements: [
      'Held firm on price by adding non-cash value (exclusivity)',
      'Preserved company margin while rewarding buyer loyalty',
      'Created ethical urgency with limited presentation window',
      'Clear next steps and timeline expectations'
    ]
  },
  // ===== OPERATIONS COORDINATOR =====
  {
    id: 'oc-escrow',
    roleId: 'operations',
    title: 'Escrow Coordination Call',
    description: 'Coordinate closing details with the title company to ensure a smooth transaction.',
    difficulty: 'Intermediate',
    type: 'phone',
    context: 'The Henderson note buyer has executed the LOI. You are managing the closing process with Chillicothe Title Company. Target closing is in 5 business days.',
    personaName: 'Jennifer Walsh',
    personaTitle: 'Title Officer, Chillicothe Title',
    steps: [
      {
        id: 'oc-es-1',
        aiText: "Hi Lisa, this is Jennifer at Chillicothe Title. I got your email about the Henderson file. I have the signed agreements. What else do you need?",
        expectedResponseHints: ['confirm documents', 'wire instructions', 'recording timeline', 'original note', 'settlement statement'],
        coachingNotes: 'Start with a checklist. Confirm: signed Purchase Agreement, Assignment Agreement, wire instructions, recording timeline, and original note delivery.',
        waitForUser: true
      },
      {
        id: 'oc-es-2',
        aiText: "Everything looks good. The buyer's wire should clear by tomorrow afternoon. I'll record same day.",
        expectedResponseHints: ['disbursement', '$68,500 seller', '$6,400 NoteWorthy', '$1,200 closing costs', 'verify numbers', 'same-day recording'],
        coachingNotes: 'Confirm the exact disbursement breakdown: $68,500 to seller, $6,400 assignment fee to NoteWorthy, $1,200 closing costs. Verify wires must CLEAR before disbursement.',
        waitForUser: true
      },
      {
        id: 'oc-es-3',
        aiText: "Got it. I'll send the settlement statement draft by 3 PM for your approval. Anything else?",
        expectedResponseHints: ['borrower notification', 'after recording', 'payment direction', 'certified mail', 'buyer receives original'],
        coachingNotes: 'Confirm post-closing items: borrower notification letter directing future payments to buyer, certified mail delivery of original note to buyer, and PDF copies to all parties within 2 hours.',
        waitForUser: true
      }
    ],
    keyPerformanceElements: [
      'Meticulous Organization - Detailed checklist with deadlines',
      'Proactive Communication - Confirms all documents and timelines',
      'Compliance-First - Verifies wire clearance before disbursement',
      'Timeline Management - Aggressive but realistic 5-day closing',
      'Documentation - Creates paper trail for every step'
    ]
  },
  {
    id: 'oc-crisis',
    roleId: 'operations',
    title: 'Crisis: Tax Lien Discovery',
    description: 'A $2,400 tax lien is discovered 48 hours before closing. Coordinate the team response.',
    difficulty: 'Advanced',
    type: 'crisis',
    context: 'The title report reveals an unpaid $2,400 property tax lien from 2023. Closing is scheduled in 2 days. All 5 team members are on an emergency call.',
    personaName: 'Emergency Team',
    personaTitle: 'All Roles',
    steps: [
      {
        id: 'oc-cr-1',
        aiText: "Team, we have a problem. The title report shows a $2,400 delinquent tax lien from 2023. This is a senior lien that must be cleared before closing. Closing is Thursday. What's our play?",
        expectedResponseHints: ['options', 'delay closing', 'pay lien', 'absorb cost', 'keep timeline', 'seller proceeds'],
        coachingNotes: 'Present options clearly: 1) Delay closing (buyer may walk), 2) Absorb cost from assignment fee (profit drops from $6,400 to $4,000 but close on time). Calculate the annualized return is still 154%.',
        waitForUser: true
      },
      {
        id: 'oc-cr-2',
        aiText: "The buyer says he'll wait 48 hours but no more. He has other capital deployed. Mrs. Henderson is 68 and probably didn't know about the lien.",
        expectedResponseHints: ['absorb cost', 'right thing', 'preserve reputation', 'testimonial', 'process improvement', '3-year verification'],
        coachingNotes: 'Recommend absorbing the cost: it is the right thing for an elderly seller, preserves buyer relationship, still highly profitable. Turn it into process improvement: verify 3 years of tax history going forward.',
        waitForUser: true
      },
      {
        id: 'oc-cr-3',
        aiText: "Agreed. I'll amend the closing statement and call Mrs. Henderson. What should I tell her?",
        expectedResponseHints: ['resolved', 'protecting interests', 'full amount', 'on track', 'heroes not accusers', 'transparency'],
        coachingNotes: 'Position NoteWorthy as heroes: "We discovered and resolved a small administrative issue. Your full $68,500 is on track for Thursday." Transparency builds trust and referrals.',
        waitForUser: true
      }
    ],
    keyPerformanceElements: [
      'Rapid Response - Emergency call convened within 1 hour',
      'No Blame Culture - Focus on solution, not fault',
      'Financial Acumen - Calculated annualized return to justify decision',
      'Customer-Centric - Protected seller from embarrassment',
      'Transparency - Honest communication with all parties',
      'Process Improvement - Turned mistake into systemic fix',
      'Profit Preservation - Still highly profitable despite setback'
    ]
  }
];

export function getScenarioById(id: string): Scenario | undefined {
  return scenarios.find(s => s.id === id);
}

export function getScenariosByRoleId(roleId: string): Scenario[] {
  return scenarios.filter(s => s.roleId === roleId);
}
