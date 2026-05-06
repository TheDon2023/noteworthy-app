import type { StudyMaterial } from '@/types';
import { referralMaterials } from './referralMaterials';

export const studyMaterials: StudyMaterial[] = [
  // Include all referral partner materials
  ...referralMaterials,

  // Core study materials by role
  // ===== SCRIPTS =====
  {
    id: 'sm-cold-call-script',
    roleId: 'acquisition',
    title: 'Cold Call Script (Live Answer)',
    type: 'script',
    content: `## Cold Call Script - Live Answer

### OPENING (First 10 Seconds)
"Good [morning/afternoon], this is [Your Name] with NoteWorthy Capital. May I speak with [Seller Name]?"

### ESTABLISH CREDIBILITY
"I'm reaching out because public records show you hold a private mortgage on a property at [Property Address]. Do you have about 90 seconds for me to explain why I'm calling?"

### INTEREST SCRIPT
"Many private note holders we talk to originally carried the financing to help someone buy a home. Some enjoy the monthly income, but others tell me they'd really rather have a lump sum of cash today—for simplifying their estate, retirement, or just to cross a big financial to-do off the list. Is that something you've ever thought about?"

### IF THEY ASK FOR PRICE
"I can't give you a solid number without a few more details, but here's how it works: we look at the current balance, the interest rate, the monthly payment, and the property value, and then our investors determine a fair cash price. The whole process is at no cost to you, and we even cover the closing fees. You'd walk away with a check in 30 to 45 days."

### THE FIVE QUALIFYING QUESTIONS
1. "What's the approximate current balance the borrower still owes?"
2. "What's the monthly payment amount, just principal and interest?"
3. "Is the borrower on time with their payments?"
4. "What's the interest rate on the note?"
5. "When did you originally create the note?"

### CLOSE
"Thank you, [Name]. Based on what you've shared, I'm confident our investors will be interested. I'll review this with my underwriting team and follow up with you by this time tomorrow with a preliminary cash offer range. What's the best email address to send that to?"

### OBJECTION: "How do I know you're legitimate?"
"That's a smart question. We're a licensed LLC operating in Ohio, and all funds flow through neutral third-party title companies—we never handle your money directly. I can also provide references from note holders we've worked with. Would that help?"

### OBJECTION: "Will the borrower be notified?"
"Excellent question. At this stage, absolutely not. The borrower is only notified AFTER a sale closes, and even then, it's a professional notification that simply directs them where to send future payments. We handle all communications with discretion."

---
**Remember**: Never promise a specific price on the first call. Always defer to the underwriting team.`
  },
  {
    id: 'sm-voicemail-script',
    roleId: 'acquisition',
    title: 'Voicemail Script',
    type: 'script',
    content: `## Voicemail Script

### THE PERFECT VOICEMAIL

"Hi, this message is for [Seller Name]. This is [Your Name] with NoteWorthy Capital.

I'm reaching out because public records show you hold a private mortgage note on [Property Address].

We help note holders convert long-term monthly payments into a lump sum of cash today—no pressure, just a free, no-obligation valuation if you're curious.

If this sounds worth a conversation, you can reach me at [Phone Number].

Again, [Phone Number].

Thanks, [Seller Name], and I hope to hear from you."

### KEY ELEMENTS CHECKLIST
- [ ] State your name and company clearly
- [ ] Reference the specific property address
- [ ] Offer "free, no-obligation valuation" (not "we buy notes")
- [ ] Repeat phone number EXACTLY TWICE
- [ ] Speak 10% slower than normal conversation pace
- [ ] Smile while speaking (it comes through in your voice)
- [ ] Total length: 20-25 seconds

### AFTER VOICEMAIL
1. Log call in CRM with tag "Voicemail-1"
2. Set follow-up call for 3 days later
3. Send SMS: "Hi [Name], this is [Your Name] from NoteWorthy Capital. I left you a voicemail about your mortgage note on [Property]. Reply YES if you'd like a free valuation, or STOP to opt out."
4. Schedule "Voicemail-2" for day 7 if no callback`
  },
  {
    id: 'sm-price-objection',
    roleId: 'acquisition',
    title: 'Handling Price Objections',
    type: 'script',
    content: `## Handling Price Objections

### OBJECTION: "That's too low"

**STEP 1: EMPATHIZE**
"I completely understand. That IS a big gap, and I'd feel the same way."

**STEP 2: RISK TRANSFER EXPLANATION**
"Remember, this price reflects what an investor can pay today while still taking on all the risk. They're absorbing the chance the borrower stops paying, they handle all the servicing and legal work, and they're responsible for the note for years to come. You're trading some of that future interest for immediate cash and zero risk."

**STEP 3: REFRAME VALUE**
"Many of our clients find that having cash in hand now is more valuable than collecting smaller payments over the next decade. You can invest that lump sum elsewhere, pay off debt, or simply enjoy retirement without worrying about payment collections."

### OBJECTION: "But the balance is $X"
"You're absolutely right—the balance is $[Amount]. And if the borrower pays for the full remaining term, you'll collect every penny plus interest. But that's a big 'if.' What we're offering is certainty. A lump sum you can count on today, without worrying about what happens next month or next year."

### OBJECTION: "I need to think about it"
"Of course, this is a big decision. Take all the time you need. I'll email you our offer in writing so you can review it with your family or financial advisor. I'll follow up in [timeframe] to answer any questions. Does that work?"

### OBJECTION: "Can you come up?"
"I hear you. Let me ask this: if I could come up by a few thousand dollars, would that be enough for us to move forward today? I can't promise anything, but I'm willing to go back to my investor and make a case. Is that something you'd be open to?"

**IMPORTANT**: Never commit to a higher number on the call. Always say "I'll check with my team/investor."`
  },
  // ===== UNDERWRITING =====
  {
    id: 'sm-ltv-calc',
    roleId: 'underwriting',
    title: 'LTV & Yield Calculation Guide',
    type: 'checklist',
    content: `## LTV & Yield Calculation Guide

### LOAN-TO-VALUE (LTV) FORMULA
\`\`\`
LTV = (Unpaid Principal Balance / Current Market Value) x 100
\`\`\`

**Example**: UPB $94,750 / Property Value $142,000 = 66.7% LTV

**Thresholds**:
- Green: ≤ 70% (proceed)
- Yellow: 70-75% (proceed with caution)
- Red: > 75% (reject or renegotiate)

### YIELD CALCULATION
\`\`\`
Current Yield = (Annual Payments / UPB) x 100
Investor Yield = (Annual Payments / Assignment Price) x 100
\`\`\`

**Example**: Annual payments $7,764 / Assignment price $76,100 = 10.2% yield

### PRICING WORKFLOW
1. **Calculate break-even purchase price**:
   - Target buyer yield = 10-12%
   - Break-even = Annual Payments / Target Yield
   - Example: $7,764 / 0.10 = $77,640

2. **Determine assignment price**:
   - Typically 80-85% of UPB
   - Example: $94,750 x 0.80 = $75,800 → round to $76,100

3. **Calculate offer to seller**:
   - Target: 68-75% of UPB
   - Example: $94,750 x 0.72 = $68,220 → round to $68,500

4. **Verify spread**:
   - Gross spread = Assignment - Purchase = $76,100 - $68,500 = $7,600
   - Net profit = Gross spread - Closing costs ($1,200) = $6,400

### KEY METRICS CHECKLIST
- [ ] LTV calculated using 3 comps (not AVM)
- [ ] Payment history verified via bank statements
- [ ] Property taxes current
- [ ] Insurance active with NoteWorthy as loss payee
- [ ] No senior liens on preliminary title
- [ ] Yield in buyer's target range
- [ ] Foreclosure timeline reviewed for state`
  },
  {
    id: 'sm-deal-review-checklist',
    roleId: 'underwriting',
    title: 'Deal Review Presentation Checklist',
    type: 'checklist',
    content: `## Deal Review Presentation Checklist

### PRESENTATION STRUCTURE
Present in this exact order every time:

**1. PROPERTY OVERVIEW**
- [ ] Property type (single-family, owner-occupied, etc.)
- [ ] Square footage and condition
- [ ] Current market value (based on 3 comps)
- [ ] County assessor value

**2. NOTE TERMS**
- [ ] Unpaid Principal Balance (UPB)
- [ ] Interest rate (fixed/variable)
- [ ] Monthly P&I payment amount
- [ ] Remaining term in months
- [ ] Payment history (months verified, % on-time)

**3. KEY METRICS**
- [ ] LTV percentage (color-coded: green/yellow/red)
- [ ] Current yield (at UPB)
- [ ] Projected buyer yield (at assignment price)
- [ ] DSCR (if rental property)
- [ ] Foreclosure state and timeline

**4. TITLE REVIEW**
- [ ] Preliminary title ordered from
- [ ] Senior liens found? (Y/N)
- [ ] Property taxes current through
- [ ] Homeowner's insurance active? (Y/N)
- [ ] HOA status

**5. RISK ASSESSMENT**
- [ ] Overall risk rating (Green/Yellow/Red)
- [ ] Equity cushion amount
- [ ] Borrower credit score
- [ ] Employment stability
- [ ] Specific state law considerations

**6. PRICING RECOMMENDATION**
- [ ] Break-even purchase price
- [ ] Recommended offer to seller
- [ ] Projected assignment price
- [ ] Gross spread
- [ ] Net profit after closing costs
- [ ] Clear PROCEED / HOLD / REJECT recommendation

**7. NEXT STEPS**
- [ ] LOI draft timeline
- [ ] Legal review needed? (Y/N)
- [ ] Buyer pool matches identified
- [ ] Special instructions for Operations`
  },
  // ===== LEGAL =====
  {
    id: 'sm-compliance-checklist',
    roleId: 'legal',
    title: 'Compliance Review Checklist',
    type: 'checklist',
    content: `## Compliance Review Checklist

### SECURITIES LAW ANALYSIS
- [ ] Apply Howey Test to each deal
- [ ] Is the note performing? (12+ months on-time)
- [ ] Is this a one-off assignment (not pooled)?
- [ ] Is the buyer an individual accredited investor?
- [ ] If borderline: Add accredited investor representation clause

### PROHIBITED LANGUAGE AUDIT
Check ALL marketing materials, emails, and scripts for:
- [ ] "Guaranteed" returns or payments
- [ ] "Risk-free" or "safe" investment
- [ ] Promises of specific yields to sellers
- [ ] "Investment advice" positioning
- [ ] Missing disclaimer footers

**Required Disclaimer**:
"This communication is for informational purposes only and does not constitute an offer to sell securities or investment advice."

### STATE COMPLIANCE
- [ ] Ohio usury cap: 8% (ORC 1343.01)
- [ ] Seasoned note exemption: > 12 months old
- [ ] Licensing requirements checked
- [ ] Mandatory Ohio consumer notice included
- [ ] Other state laws if applicable

### CONTRACT REVIEW POINTS
- [ ] No "guarantee" of future payments
- [ ] "Represents" instead of "guarantees"
- [ ] Due diligence escape clause present
- [ ] Assignment recorded with county recorder
- [ ] Physical business address on all communications
- [ ] Unsubscribe link on all marketing emails (CAN-SPAM)
- [ ] NDA executed before property details shared

### FAIR LENDING CHECK
- [ ] ECOA compliance reviewed
- [ ] No discriminatory practices in original note
- [ ] Evaluation based purely on financial metrics
- [ ] Documentation of non-discriminatory basis`
  },
  {
    id: 'sm-nda-template',
    roleId: 'legal',
    title: 'NDA Hold Template',
    type: 'template',
    content: `## NDA Policy - Response Template

### WHEN BUYER REFUSES NDA

"I understand the time pressure, but the NDA is non-negotiable. Here's why:

1. **It protects our seller's identity** - They entrusted us with confidential information
2. **It protects our proprietary underwriting work** - Our analysis is our intellectual property
3. **It prevents circumvention** - Even reputable institutions can inadvertently share details

**Solutions to keep momentum**:
- We can execute the NDA in 5 minutes via DocuSign
- I can send you a blind teaser RIGHT NOW (no NDA needed)
- The moment the NDA is signed, you'll receive the full package

**Red flag indicator**: If a buyer pushes back on signing a standard NDA, it may indicate their internal processes don't align with our protection standards. Serious buyers sign NDAs without hesitation—it's standard practice in our industry.

### BLIND TEASER TEMPLATE (No NDA Required)

**Asset Type**: Performing private mortgage note
**Property**: Single-family, owner-occupied residence in [State]
**UPB**: $XX,XXX
**Monthly Payment**: $XXX P&I
**Interest Rate**: X.X% fixed
**Payment History**: XX months, 100% on-time (bank-verified)
**LTV**: XX.X% (property valued at $XXX,XXX)
**Remaining Term**: XX years
**Projected Yield**: X.X% at assignment price

*Full due diligence package including property address, title report, payment history, and comps available upon NDA execution.*`
  },
  // ===== BUYER RELATIONS =====
  {
    id: 'sm-buyer-qualification',
    roleId: 'buyer-relations',
    title: 'Buyer Qualification Framework',
    type: 'checklist',
    content: `## 4-Part Buyer Qualification Framework

### PART 1: FINANCIAL VETTING
- [ ] Proof of funds letter from bank (for transactions >$50K)
- [ ] Letter of credit or bank reference
- [ ] For institutional buyers: verify AUM
- [ ] Minimum liquidity threshold: $100K+

### PART 2: TRACK RECORD ANALYSIS
- [ ] References from prior note purchases (minimum 2)
- [ ] Contact prior title companies or brokers
- [ ] Confirm history of clean, timely closings
- [ ] Verify experience with note servicing

### PART 3: CRITERIA ALIGNMENT
Verify buyer's stated criteria matches the deal:
- [ ] Target yield range (typically 9-14%)
- [ ] Preferred LTV maximum (typically <75%)
- [ ] Geographic preferences (states)
- [ ] Minimum payment amount ($500+/month preferred)
- [ ] Owner-occupied vs. tenant-occupied preference
- [ ] Close timeline capability (typically 5-10 days)

### PART 4: COMPLIANCE VERIFICATION
- [ ] Accredited investor status (Rule 501 of Regulation D):
  - Individual net worth >$1M (excluding primary residence), OR
  - Individual income >$200K ($300K joint) for last 2 years
- [ ] NDA executed and on file
- [ ] Understanding of applicable regulations
- [ ] For large transactions: Qualified Institutional Buyer (QIB) status

### BUYER ONBOARDING SCRIPT
"Before we discuss deals, I need to understand your criteria. What is your target yield and preferred LTV?"

[Listen and log]

"Perfect. To add you to our qualified buyer list, I'll need:
1. Proof of funds or bank letter
2. Two references from prior note purchases
3. Signed NDA (I can send via DocuSign right now)

Once verified, you'll receive blind deal summaries before they go to the broader pool."

### BUYER CRM TAGS
- Tier A: Pre-qualified, fast closer, repeat buyer
- Tier B: Qualified, occasional buyer
- Tier C: Pending documentation
- Inactive: >90 days since last purchase`
  },
  // ===== OPERATIONS =====
  {
    id: 'sm-escrow-checklist',
    roleId: 'operations',
    title: 'Escrow Coordination Checklist',
    type: 'checklist',
    content: `## Escrow Coordination Checklist

### PRE-CLOSING (T-5 Days)

**Documents to Collect:**
- [ ] Original Promissory Note (endorsed in blank)
- [ ] Original Mortgage/Deed of Trust
- [ ] Assignment of Mortgage (signed, notarized)
- [ ] Seller's Affidavit
- [ ] Copy of government-issued ID (seller)
- [ ] W-9 form (seller)
- [ ] Wire transfer instructions (buyer, on letterhead)
- [ ] LLC operating agreement or certificate of good standing
- [ ] Signed Assignment Agreement
- [ ] Proof of accredited investor status

**Title Company Requirements:**
- [ ] Preliminary Title Report ordered and received
- [ ] Payment history verification (bank statements)
- [ ] Property valuation report (3 comps)
- [ ] Escrow number assigned
- [ ] Closing date confirmed

### CLOSING DAY

**Before Funding:**
- [ ] All documents received and reviewed
- [ ] Buyer wire initiated and CLEARED (not just received)
- [ ] Assignment properly executed and notarized
- [ ] Original Note received and verified
- [ ] Settlement statement approved

**Funding & Recording:**
- [ ] Assignment of Mortgage recorded SAME DAY as funding
- [ ] Recording number obtained within 24 hours
- [ ] Disbursement only after recording confirmed

**Disbursement Breakdown:**
- [ ] Seller receives payoff amount
- [ ] NoteWorthy receives assignment fee
- [ ] Title company receives closing costs
- [ ] Recording fees paid

### POST-CLOSING (Within 24 Hours)

**Document Distribution:**
- [ ] Original Note & Mortgage to Buyer via certified mail
- [ ] Recorded Assignment PDF to all parties
- [ ] Final Settlement Statement distributed
- [ ] Borrower Notification Letter sent

**Internal:**
- [ ] CRM updated to "Closed-Won"
- [ ] File archived in secure cloud storage
- [ ] 1099-S issuance scheduled (if applicable)
- [ ] Referral request sent to seller
- [ ] Post-close satisfaction survey sent

### CRITICAL REMINDERS
- NEVER release funds until wire has CLEARED
- NEVER skip recording before disbursement
- ALWAYS confirm NDA on file before sharing property details
- ALWAYS send borrower notification within 24 hours of recording`
  },
  {
    id: 'sm-crisis-playbook',
    roleId: 'operations',
    title: 'Crisis Response Playbook',
    type: 'template',
    content: `## Crisis Response Playbook

### TAX LIEN DISCOVERED

**IMMEDIATE ACTIONS (Within 1 Hour):**
1. Convene emergency team call
2. Assess lien priority and amount
3. Determine if deal can still close on time

**DECISION FRAMEWORK:**

Option A: Delay Closing
- Require seller to pay off lien before proceeding
- Timeline impact: 7-10 days minimum
- Risk: Buyer may walk

Option B: Absorb Cost
- Pay lien from assignment fee at closing
- Profit reduced but deal preserved
- Calculate: Is annualized return still acceptable?

**COMMUNICATION SCRIPTS:**

To Seller:
"Mrs. Henderson, we discovered a small administrative issue—a tax lien that was inadvertently not paid. We've already resolved it to protect your interests, and your full [Amount] is still on track for [Date]."

To Buyer:
"We've identified and resolved a minor title matter. The tax lien has been satisfied, clear title will be delivered, and we're on schedule for [Date] closing."

**PROCESS IMPROVEMENT:**
After crisis resolution:
- [ ] Update underwriting checklist
- [ ] Add verification step that would have caught it
- [ ] Re-review all active files for similar issues
- [ ] Document lessons learned in SOP

### WIRE DELAY

**Actions:**
1. Contact buyer immediately to confirm wire status
2. Coordinate with title company on cutoff times
3. If wire misses cutoff: reschedule recording for next business day
4. Notify all parties of 1-day delay
5. NEVER disburse before wire clears

### MISSING DOCUMENTS DAY-OF-CLOSING

**Priority Order:**
1. Original Note (CLOSING CANNOT PROCEED without it)
2. Signed Assignment (can be overnighted if notarized)
3. W-9 (can follow within 30 days for 1099)
4. ID copy (can be emailed same day)

**General Rule**: If critical documents are missing, delay closing rather than risk an incomplete file.`
  },
  // ===== GENERAL =====
  {
    id: 'sm-glossary',
    roleId: 'acquisition',
    title: 'Note Investing Glossary',
    type: 'glossary',
    content: `## Note Investing Glossary

### A
**Accredited Investor**: Individual meeting SEC criteria (net worth >$1M or income >$200K) required for certain investment transactions.

**Assignment**: The legal transfer of a note and mortgage from one party to another.

### B
**Borrower**: The person who took out the original loan and is making payments.

**Buyer's List**: A curated database of qualified investors ready to purchase performing notes.

### C
**CMV (Current Market Value)**: The present-day value of the property securing the note.

**DSCR (Debt Service Coverage Ratio)**: Net operating income divided by annual debt payments. A DSCR of 1.25x means the property generates 25% more income than required.

### E
**Escrow**: A neutral third party (title company) that holds funds and documents until all deal conditions are met.

### F
**Foreclosure**: The legal process of taking possession of a property when the borrower defaults.

### H
**Howey Test**: A Supreme Court ruling used to determine whether a transaction qualifies as an "investment contract" (security) under federal law.

### J
**Judicial Foreclosure**: Foreclosure process requiring court oversight (e.g., Ohio). Takes 8-12 months on average.

### L
**Letter of Intent (LOI)**: A preliminary document expressing intent to purchase, subject to due diligence.

**LTV (Loan-to-Value)**: The ratio of the loan balance to the property's current market value. LTV = UPB / CMV.

### N
**Non-Judicial Foreclosure**: Foreclosure process NOT requiring court oversight (e.g., Texas). Typically faster.

**Note Holder**: The person or entity receiving payments on a private mortgage.

### P
**Performing Note**: A note where the borrower has been making on-time payments consistently.

**Preliminary Title Report**: A title company document showing the property's ownership history and any liens.

### S
**Seasoned Note**: A note that has been in place for more than 12 months with consistent payment history.

**Seller Financing**: When a property seller acts as the lender by carrying back a mortgage.

**Spread**: The difference between your purchase price and your assignment/sale price. This is your gross profit.

### U
**UPB (Unpaid Principal Balance)**: The remaining loan amount the borrower still owes, not including interest.

**Usury**: Laws limiting the interest rate that can be charged on loans. Ohio cap: 8% for consumer loans.

### Y
**Yield**: Annual return on investment expressed as a percentage. Yield = (Annual Payments / Purchase Price) x 100.`
  }
];

export function getStudyMaterialsByRoleId(roleId: string): StudyMaterial[] {
  return studyMaterials.filter(s => s.roleId === roleId);
}
