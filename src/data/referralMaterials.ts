import type { StudyMaterial } from '@/types';

export const referralMaterials: StudyMaterial[] = [
  {
    id: 'sm-referral-overview',
    roleId: 'referral-partner',
    title: 'Referral Partner Program Overview',
    type: 'checklist',
    content: `## Referral Partner Program -- Overview

### WHAT IS A REFERRAL PARTNER?
A referral partner is a trusted professional or community leader who introduces qualified note buyers to NoteWorthy Capital. They are NOT employees -- they are independent relationships built on mutual value and trust.

### WHY REFERRAL PARTNERS MATTER
- **Scalable buyer acquisition** -- One CPA with 40 investor clients can introduce 5-10 qualified buyers per year
- **Warm introductions** -- Referral trust transfers to NoteWorthy, shortening the sales cycle
- **Low cost per acquisition** -- Referral fees are performance-based (paid only on closed deals)
- **Market penetration** -- Meetup organizers, CPAs, and attorneys have access to audiences we cannot reach directly
- **Credibility amplification** -- A CPA's endorsement carries more weight than any ad campaign

### TYPES OF REFERRAL PARTNERS

| Partner Type | Typical Reach | Conversion Rate | Annual Buyers |
|-------------|--------------|-----------------|---------------|
| CPA/Tax Advisor | 30-50 investor clients | 10-15% | 3-8 |
| REI Meetup Organizer | 200-500 members | 2-5% | 4-12 |
| Real Estate Attorney | 20-40 active investors | 15-25% | 3-10 |
| Mortgage Broker | 50-100 past clients | 5-10% | 3-8 |
| Wealth Manager | 20-50 HNW clients | 10-20% | 2-6 |
| REI Educator/Coach | 100-1,000 students | 1-3% | 1-5 |

### REFERRAL PARTNER TIERS

**Tier 1 -- Active Partner**
- Makes 3+ qualified introductions per quarter
- Receives $500 per closed referral
- Gets first look at new deals
- Invited to quarterly partner calls

**Tier 2 -- Strategic Partner**
- Makes 1-2 qualified introductions per quarter
- Receives $350 per closed referral
- Added to deal announcement list
- Receives monthly market update

**Tier 3 -- Affiliate Partner**
- Occasional introductions (1-2 per year)
- Receives $250 per closed referral
- Receives quarterly newsletter

### THE REFERRAL PROCESS (5 Steps)

1. **IDENTIFY** -- Find partners through networking, events, and research
2. **QUALIFY** -- Vet the partner's audience, reputation, and professionalism
3. **EDUCATE** -- Provide materials so they understand notes and can speak confidently
4. **INTRODUCE** -- Partner makes warm introduction (email, call, or event)
5. **CLOSE & COMPENSATE** -- Track referral to closing, pay fee within 48 hours of funding

### LARK BASE CRM SETUP

All referral partner activity is tracked in Lark Base. See the "Lark Base CRM Setup Guide" study material for complete table structures and automation rules.
`
  },
  {
    id: 'sm-lark-crm-setup',
    roleId: 'referral-partner',
    title: 'Lark Base CRM Setup Guide',
    type: 'checklist',
    content: `## Lark Base CRM Setup Guide

### OVERVIEW
Lark Base is your internal command center and lightweight CRM for managing the entire referral partner and buyer funnel. Use it to track contacts, content distribution, deal flow, and referral relationships.

### TABLE 1: Buyer Pool
Purpose: Master database of all potential and active note buyers

| Field | Type | Description |
|-------|------|-------------|
| Full Name | Text | Buyer's complete name |
| Email | Email | Primary email address |
| Phone | Phone | Primary phone number |
| Lead Source | Single Select | Landing Page, Referral, Event, Cold Outreach, Other |
| Landing Page Source | Link | Which landing page they came from |
| Status | Single Select | New Lead, Contacted, Qualified, Active Buyer, Inactive |
| Accredited Investor | Checkbox | Verified accredited investor status |
| Date Added | Date | When the record was created |
| Last Contact | Date | Most recent interaction |
| Notes | Rich Text | Free-form notes and context |
| Referral Partner | Lookup | Link to Referral Partners table (if applicable) |

### TABLE 2: Referral Partners
Purpose: Track all referral partners and their performance

| Field | Type | Description |
|-------|------|-------------|
| Partner Name | Text | Partner's full name or business name |
| Partner Type | Single Select | CPA, Meetup Organizer, Attorney, Broker, Wealth Manager, Other |
| Contact Person | Text | Primary contact if different from business name |
| Email | Email | Primary email |
| Phone | Phone | Primary phone |
| Website | Link | Partner's website or social profile |
| Audience Size | Number | Approximate size of their network |
| Audience Description | Rich Text | Who they serve (e.g., "40 real estate investor clients") |
| Tier | Single Select | Tier 1 (Active), Tier 2 (Strategic), Tier 3 (Affiliate) |
| Status | Single Select | Prospecting, Active, Paused, Inactive |
| Referral Fee Rate | Number | Dollar amount per closed referral ($250-$500) |
| Total Referrals | Number | Cumulative introductions made |
| Total Closed | Number | Referrals that resulted in closed deals |
| Total Paid | Currency | Total referral fees paid to date |
| Date Added | Date | When partner was onboarded |
| Last Activity | Date | Most recent interaction |
| Notes | Rich Text | Relationship notes, preferences, history |

### TABLE 3: Content Library
Purpose: Central repository of all sales content, emails, and landing pages

| Field | Type | Description |
|-------|------|-------------|
| Content Name | Text | Descriptive name of the content piece |
| Content Type | Single Select | Email, Landing Page, PDF Guide, Video, Script, Other |
| Topic | Single Select | Introduction, Education, Deal Announcement, Follow-Up, Closing |
| Funnel Stage | Single Select | Awareness, Interest, Consideration, Decision, Retention |
| File/Link | Link | URL to the content or file attachment |
| Landing Page URL | Link | If applicable, the live page URL |
| Related Email Sequence | Lookup | Link to Email Sequences table |
| Date Created | Date | When content was created |
| Last Updated | Date | Last modification date |
| Performance Notes | Rich Text | Conversion data, A/B test results, feedback |

### TABLE 4: Email Sequences
Purpose: Track automated email campaigns and their performance

| Field | Type | Description |
|-------|------|-------------|
| Sequence Name | Text | Name of the email sequence |
| Trigger Event | Single Select | Landing Page Submit, Referral Intro, Event Attendance, Status Change |
| Purpose | Rich Text | What this sequence is designed to accomplish |
| Number of Emails | Number | Total emails in the sequence |
| Timing Pattern | Text | e.g., "Day 0, 3, 7, 14, 30" |
| Status | Single Select | Draft, Active, Paused, Retired |
| Open Rate | Percent | Average open rate across sends |
| Click Rate | Percent | Average click-through rate |
| Conversion Rate | Percent | Leads converted to qualified buyers |
| Date Created | Date | When sequence was built |
| Related Content | Lookup | Links to Content Library records |
| Notes | Rich Text | Performance notes and optimization ideas |

### TABLE 5: Referral Activity Log
Purpose: Track every introduction and referral event

| Field | Type | Description |
|-------|------|-------------|
| Date | Date | Date of the referral activity |
| Referral Partner | Lookup | Link to Referral Partners table |
| Activity Type | Single Select | Introduction Email, Phone Call, Event Presentation, Material Shared |
| Buyer Contact | Lookup | Link to Buyer Pool table (if known) |
| Buyer Name (Manual) | Text | If not yet in Buyer Pool, manual entry |
| Notes | Rich Text | Details of the interaction |
| Outcome | Single Select | Pending, Buyer Engaged, Deal Closed, No Response, Declined |
| Referral Fee Paid | Currency | Amount paid for this referral (if applicable) |
| Date Paid | Date | When fee was disbursed |

### TABLE 6: Events & Outreach
Purpose: Track networking events, meetups, and outreach campaigns

| Field | Type | Description |
|-------|------|-------------|
| Event Name | Text | Name of the event or campaign |
| Event Type | Single Select | Meetup, Seminar, Webinar, Trade Show, Cold Outreach, Partnership |
| Date | Date | Event date |
| Partner/Organizer | Lookup | Link to Referral Partners table (if applicable) |
| Location | Text | Physical or virtual location |
| Attendees/Leads | Number | Number of people reached or leads generated |
| Qualified Leads | Number | Number that met buyer criteria |
| Deals Closed | Number | Deals resulting from this event |
| Cost | Currency | Total cost (food, materials, time) |
| ROI | Formula | (Deals Closed x Avg Assignment Fee) / Cost |
| Content Used | Lookup | Link to Content Library |
| Follow-Up Status | Single Select | Scheduled, In Progress, Complete, No Follow-Up |
| Notes | Rich Text | Detailed notes and lessons learned |

### AUTOMATION RULES (Lark Base)

1. **New Buyer Alert**: When a new record is added to Buyer Pool with Status = "New Lead", send Lark message to #buyer-leads channel
2. **Referral Fee Trigger**: When Referral Activity Log Outcome = "Deal Closed", create task in #finance to process referral fee within 48 hours
3. **Partner Tier Upgrade**: When Referral Partners Total Closed >= 3, update Tier to "Tier 1" and notify team
4. **Stale Lead Reminder**: When Buyer Pool Last Contact is > 30 days old, flag for follow-up
5. **Content Performance Review**: Monthly, generate report of all Content Library items by Funnel Stage and conversion rates
`
  },
  {
    id: 'sm-landing-pages',
    roleId: 'referral-partner',
    title: 'Landing Page Templates & Funnel Strategy',
    type: 'template',
    content: `## Landing Page Templates & Funnel Strategy

### THE BUYER ACQUISITION FUNNEL

STAGES: AWARENESS -> INTEREST -> CONSIDERATION -> DECISION -> RETENTION

- AWARENESS: Landing Pages, Social Media, Events, Referrals
- INTEREST: Email Sequences, Case Studies, Webinars, Deal Alerts
- CONSIDERATION: Qualification, DD Package, Buyer Criteria, NDA/POF
- DECISION: LOI/Close, Signing, Wire/Title, Recording
- RETENTION: Monthly Reports, Deal Alerts, Referral Program, Events

---

### LANDING PAGE #1: "Note Investing 101" -- Lead Generation
**Purpose**: Capture contact info from curious but uneducated prospects
**Traffic Sources**: Social media ads, REI forums, podcast show notes

**PAGE STRUCTURE:**

**Hero Section**
- Headline: "Earn Passive Income with Real Estate Notes -- Without Tenants, Toilets, or Termites"
- Subhead: "Free Guide: The Beginner's Roadmap to Mortgage Note Investing"
- CTA Button: "Send Me the Free Guide"
- Form Fields: First Name, Email, Phone (optional)
- Trust Badge: "Join 500+ investors who downloaded this guide"

**Below the Fold**
- Section 1: "What Is a Mortgage Note?" (Simple explanation with illustration)
- Section 2: "3 Reasons Notes Beat Rental Properties" (Bullet points)
- Section 3: "What Our Buyers Say" (2-3 testimonials with photos)
- Final CTA: "Get Your Free Guide Now"

**AUTOMATION TRIGGER**: Form submission -> Welcome Email Sequence (Day 0)

---

### LANDING PAGE #2: "Deal Announcement" -- Interest Nurture
**Purpose**: Present a specific deal to your buyer list and drive engagement
**Traffic Sources**: Email blast to Buyer Pool, partner introductions

**PAGE STRUCTURE:**

**Hero Section**
- Headline: "New Performing Note Available -- 11.2% Target Yield"
- Subhead: "Single-family, owner-occupied -- Chillicothe, OH"
- CTA Button: "Request Full Due Diligence Package"
- Urgency: "Available for review until [Date]"

**Blind Summary Section**
- Asset Type: Performing private mortgage note
- Property: Single-family, owner-occupied residence
- UPB: $XX,XXX
- Monthly Payment: $XXX P&I
- Interest Rate: X.X% fixed
- Payment History: XX months, 100% on-time (bank-verified)
- LTV: XX.X% (property valued at $XXX,XXX)
- Remaining Term: XX years
- Projected Yield: X.X% at assignment price
- Disclaimer: "Full due diligence package including property address, title report, payment history, and comps available upon NDA execution."

**Below the Fold**
- Section 1: "How the Process Works" (5-step visual timeline)
- Section 2: "Frequently Asked Questions" (5 common questions)
- Section 3: "Past Deals" (3 recent closings with yields)
- Final CTA: "Request DD Package"

**AUTOMATION TRIGGER**: NDA signed -> Full DD Package sent within 24 hours

---

### LANDING PAGE #3: "Buyer Qualification" -- Consideration
**Purpose**: Qualify serious buyers and collect criteria/preferences
**Traffic Sources**: Email click-throughs from LP #2, direct referrals

**PAGE STRUCTURE:**

**Hero Section**
- Headline: "Join Our Qualified Buyer Network"
- Subhead: "Get first access to performing notes before they go public"
- CTA Button: "Apply Now -- It's Free"

**Qualification Form**
- Name, Email, Phone
- Target Yield Range: [ ] 8-10% [ ] 10-12% [ ] 12-14% [ ] 14%+
- Preferred States: [Multi-select]
- Minimum Monthly Payment: [Text field]
- Maximum LTV: [ ] 60% [ ] 65% [ ] 70% [ ] 75% [ ] 80%
- Preferred Property Type: [ ] Single-family [ ] Multi-family [ ] Commercial
- Investment Timeline: [ ] Immediate [ ] 30 days [ ] 90 days
- Accredited Investor: [ ] Yes [ ] No [ ] Working on it
- Proof of Funds Available: [ ] Yes [ ] No

**Below the Fold**
- Section 1: "What Qualified Buyers Get" (First look, blind summaries, priority access)
- Section 2: "Our Track Record" (Deals closed, repeat buyer rate)
- Section 3: "FAQ" (NDA requirements, closing timeline, servicing transfer)

**AUTOMATION TRIGGER**: Form submission -> Qualification Review -> Welcome Call Scheduled

---

### LANDING PAGE #4: "Direct Offer" -- Decision
**Purpose**: Close a buyer who has reviewed the DD package
**Traffic Sources**: Personal email from Buyer Relations Manager

**PAGE STRUCTURE:**

**Hero Section**
- Headline: "Secure This Note -- [Property City], [State]"
- Subhead: "Assignment price: $XX,XXX | Target yield: X.X%"
- CTA Button: "Submit LOI"
- Countdown: "48-hour exclusive review window expires [Date/Time]"

**Deal Summary**
- Full property details (address revealed post-NDA)
- Complete payment history table
- Property photos and comps map
- Title report summary
- Assignment agreement terms
- Closing timeline: 10 business days

**LOI Form**
- Purchase price offer (pre-filled with assignment price)
- Closing date preference
- Title company preference
- Wire transfer instructions upload
- Digital signature

**AUTOMATION TRIGGER**: LOI submitted -> Operations notified -> Closing process initiated

---

### LANDING PAGE #5: "Partner Portal" -- Retention & Referral
**Purpose**: Give active buyers a dashboard and encourage referrals
**Traffic Sources**: Post-closing email, buyer portal login

**PAGE STRUCTURE:**
- Welcome message with buyer's name
- Active notes portfolio (if multiple purchases)
- Monthly payment tracker
- New deal alerts (personalized based on criteria)
- Refer a Friend section: "Know another investor? Earn $500 when they close their first deal."
- Educational content library access
- Direct message to NoteWorthy team
`
  },
  {
    id: 'sm-email-sequences',
    roleId: 'referral-partner',
    title: 'Email Automation Sequences',
    type: 'template',
    content: `## Email Automation Sequences

### SEQUENCE 1: "Welcome Nurture" -- New Landing Page Leads
**Trigger**: Form submission on "Note Investing 101" landing page
**Goal**: Educate and build trust over 30 days

---

**EMAIL 1 -- Welcome + Guide Delivery (Day 0, immediate)**

Subject: Your Note Investing Guide is here + one quick question

Hi [First Name],

Thanks for downloading "The Beginner's Roadmap to Mortgage Note Investing."

Your guide is attached. Inside you'll learn:
- What a mortgage note actually is (in plain English)
- How note investors earn returns without property management headaches
- The 5 key metrics every note buyer should know
- Common mistakes first-time note buyers make

**One quick question while you're reading:**
Are you currently invested in real estate, or are you exploring notes as your first real estate investment? Just hit reply and let me know -- I read every response.

To your success,
[Your Name]
NoteWorthy Capital

P.S. -- Keep an eye on your inbox. Over the next few weeks I'll share real case studies from notes we've closed, including actual yield numbers.

---

**EMAIL 2 -- Case Study (Day 3)**

Subject: How a retired teacher earns 11.2% on her first note

Hi [First Name],

I want to share a real story from one of our buyers.

Maria is a 52-year-old retired teacher from Columbus. She had $250K sitting in an IRA earning 2%.

She bought her first note through us -- a performing mortgage on a single-family home in Chillicothe, OH.

Here are the numbers:
- Purchase price: $76,100
- Monthly payment received: $647
- Annual return: 11.2%
- Property LTV: 66.7% (strong equity cushion)
- She collects the payment every month. No tenants. No repairs. No property management.

"I was nervous at first," Maria told us, "but the team walked me through every step. Now my husband wants to buy one too."

Want to see our current deal inventory? [Click here to browse available notes]

Best,
[Your Name]

---

**EMAIL 3 -- Education (Day 7)**

Subject: The #1 question new note buyers ask us

Hi [First Name],

The #1 question we get from new note buyers:

"What happens if the borrower stops paying?"

It's the right question to ask. Here's the honest answer:

**Yes, borrower default is a risk.** But here's how we protect against it:

1. **LTV (Loan-to-Value)**: We only sell notes where the loan balance is 70% or less of the property value. That means there's at least 30% equity protecting your investment.

2. **Payment History**: We only sell performing notes with at least 12 months of verified, on-time payments.

3. **First Lien Position**: Every note we sell is a first mortgage -- you get paid first if anything happens.

4. **Property Type**: We focus on owner-occupied single-family homes -- the most stable property type.

5. **Insurance**: Every property has active hazard insurance with you listed as the mortgagee.

In the worst case, you have the legal right to foreclose and take the property. With a 30%+ equity cushion, even a foreclosure can still result in a positive outcome.

**Bottom line**: Notes are not risk-free. But with proper underwriting, the risk is manageable and the returns are compelling.

Have questions? Just reply to this email.

[Your Name]

---

**EMAIL 4 -- Social Proof (Day 14)**

Subject: "Why didn't I do this sooner?" -- buyer feedback

Hi [First Name],

I asked three of our recent buyers: "What surprised you most about note investing?"

Here's what they said:

**James T., Columbus, OH** -- "How passive it actually is. I get an ACH deposit every month and a statement. That's it. No 2 AM toilet leaks."

**David K., Cincinnati, OH** -- "The speed of closing. I signed the LOI on Monday, wired funds Thursday, and got my first payment the next month."

**Robert C., CPA, Cleveland, OH** -- "The tax efficiency. My clients hold notes in self-directed IRAs. Tax-deferred growth at 11%+ -- you can't get that in a brokerage account."

Ready to talk about your first note? [Schedule a 15-min call here]

[Your Name]

---

**EMAIL 5 -- Soft CTA (Day 21)**

Subject: Curious what deals we have right now?

Hi [First Name],

We're adding 2-3 new performing notes to our inventory every month.

Current sample inventory:
- Chillicothe, OH -- 11.2% yield, $76K assignment, 66.7% LTV
- Dayton, OH -- 10.8% yield, $62K assignment, 71.2% LTV
- Springfield, OH -- 12.1% yield, $89K assignment, 64.3% LTV

Want the full details on any of these? Just reply with the city name and I'll send you the blind summary.

[Your Name]

---

**EMAIL 6 -- Final CTA (Day 30)**

Subject: Ready when you are, [First Name]

Hi [First Name],

Over the past month, I've shared:
- The beginner's guide to note investing
- A real buyer case study (11.2% returns)
- How we protect against risk (LTV, payment history, first lien)
- What actual buyers say about the experience
- Our current deal inventory

If you're ready to explore further, here's what happens next:

1. **Schedule a 15-min call** -- We'll discuss your goals, criteria, and answer any questions
2. **Get qualified** -- Quick verification of accredited investor status and proof of funds
3. **Receive blind summaries** -- First look at new deals matching your criteria

[Schedule Your Call Here]

No pressure. No obligation. Just a conversation.

[Your Name]
NoteWorthy Capital

---

### SEQUENCE 2: "Referral Partner Nurture"
**Trigger**: Referral partner signs up or expresses interest
**Goal**: Equip partners to make quality introductions

**EMAIL 1 -- Welcome + Materials (Day 0)**
Subject: Welcome to the NoteWorthy Partner Network

**EMAIL 2 -- Education (Day 3)**
Subject: How to talk about notes with your clients (scripts inside)

**EMAIL 3 -- Case Study (Day 7)**
Subject: How one CPA introduced 5 buyers in 6 months

**EMAIL 4 -- Deal Alert (Day 14, ongoing)**
Subject: New deal available for your network -- [City], [State]

**EMAIL 5 -- Check-in (Day 30)**
Subject: How can we support you this month?

---

### SEQUENCE 3: "Deal Announcement" -- Active Buyers
**Trigger**: New deal passes underwriting
**Goal**: Generate buyer interest and drive LOIs

**EMAIL 1 -- Blind Summary (Day 0)**
Subject: New Note Available -- [City], [State] -- X.X% yield

**EMAIL 2 -- Reminder (Day 3)**
Subject: 48 hours left -- [City] note review window closing

**EMAIL 3 -- Final Call (Day 5)**
Subject: Last call: [City] note -- review window expires tomorrow
`
  },
  {
    id: 'sm-referral-scripts',
    roleId: 'referral-partner',
    title: 'Referral Partner Conversation Scripts',
    type: 'script',
    content: `## Referral Partner Conversation Scripts

### SCRIPT 1: Approaching a CPA

**SETTING**: Initial call or in-person meeting with a CPA who serves real estate investor clients

**OPENING:**
"[CPA Name], I know your clients are always looking for tax-efficient passive income strategies. I wanted to introduce you to something that might be a fit for some of them -- mortgage note investing.

Notes can be held in self-directed IRAs, generate 10-12% returns, and avoid the property management headaches that burn out so many rental investors. I thought it might be worth a brief conversation to see if this is something you'd want to know more about for your clients."

**IF INTERESTED:**
"Here's what makes this compelling from a tax perspective:
- Notes held in self-directed IRAs grow tax-deferred
- Note payments generate 1099-INT income -- straightforward reporting
- When notes are sold, 1099-S captures the gain
- Unlike rentals, no depreciation recapture
- Unlike flips, no short-term capital gains treatment

I'd love to send you our Tax Guide for Note Investors. It's a one-page summary specifically written for CPAs. Would that be helpful?"

**THE ASK:**
"[CPA Name], would you be open to a co-hosted educational webinar for your clients? You cover the tax implications, we cover how notes work. No selling -- pure education. If any clients are interested afterward, we can discuss individually."

---

### SCRIPT 2: Approaching a Meetup Organizer

**SETTING**: Email or call to REI meetup organizer

**OPENING:**
"Hi [Organizer Name], I'm [Your Name] with NoteWorthy Capital. I came across your meetup group and was impressed by the community you've built.

I specialize in mortgage note investing -- an alternative to rental properties that a lot of investors haven't explored. I'd love to offer a presentation to your group that's purely educational -- no sales pitch.

Attendees would learn:
- How notes work (becoming the bank instead of the landlord)
- The 5 metrics for evaluating any note
- A real case study walkthrough with actual numbers
- How to get started with a small first investment

Plus, I'd sponsor refreshments and provide a free Note Evaluation Checklist for every attendee."

**IF INTERESTED:**
"I can send you my presentation outline and the first few slides for your review. I want you to be 100% comfortable with the content before we book anything. And I'm happy to provide references from other meetup organizers I've presented to."

---

### SCRIPT 3: The Referral Introduction Email

**SETTING**: Referral partner is introducing a potential buyer to NoteWorthy

**TEMPLATE:**

Subject: Introduction -- [Buyer Name] + NoteWorthy Capital

Hi [Buyer Name],

I wanted to introduce you to [Your Name] at NoteWorthy Capital. I've gotten to know their team and have been impressed by their professionalism and transparency.

NoteWorthy specializes in performing mortgage notes -- a way to earn passive real estate income without tenants, repairs, or property management. Given your interest in [relevant context], I thought this might be worth exploring.

[Your Name], [Buyer Name] is [brief description -- e.g., "a fellow investor in my mastermind group who owns 8 rentals in Dayton"].

I'll let you two take it from here.

Best,
[Partner Name]

---

**FOLLOW-UP FROM NOTEWORTHY:**

Hi [Buyer Name],

Thanks so much to [Partner Name] for the introduction. It's always a pleasure connecting with investors who come recommended.

As [Partner Name] mentioned, we specialize in performing mortgage notes in Ohio and surrounding states. Our buyers typically see 10-12% annual returns on notes backed by owner-occupied single-family homes.

I'd love to schedule a brief 15-minute call to learn about your investment goals and see if notes might be a fit. No pressure -- just a conversation.

Would [Day] at [Time] work for you? If not, I'm flexible.

Best,
[Your Name]
NoteWorthy Capital

---

### SCRIPT 4: Referral Fee Conversation

**SETTING**: Discussing compensation with a referral partner

**OPENING:**
"[Partner Name], I want to be completely transparent about how we compensate partners who introduce qualified buyers.

For every investor you introduce who closes a deal with us, we pay a referral fee of $500, disbursed within 48 hours of closing.

This isn't a favor -- it's a business arrangement. We value your network and your reputation, and we want this to be mutually beneficial.

Here's what we provide you:
- Our Tax Guide for Note Investors (for CPAs)
- Presentation materials and slide decks (for meetup organizers)
- Regular deal alerts you can forward to your network
- Monthly partner updates on new inventory
- Priority access to our buyer education webinars

What questions do you have about the arrangement?"

---

### SCRIPT 5: Follow-Up After Partner Event

**SETTING**: Post-event follow-up call with partner

**OPENING:**
"[Partner Name], thank you again for hosting us at [Event Name]. It was a fantastic event.

Here's what happened:
- [X] attendees at the presentation
- [Y] requested our free evaluation checklist
- [Z] scheduled follow-up calls

I wanted to check in: How did the presentation land with your group? Any feedback I should incorporate for next time?

Also, [Name] and [Name] both mentioned they came because of your recommendation. That means a lot -- your members clearly trust your curation.

I'm already looking forward to the next one. Should we get something on the calendar for [Month]?"

---

### KEY PRINCIPLES FOR ALL PARTNER CONVERSATIONS

1. **Lead with value, not the ask** -- Show what's in it for THEM and their network first
2. **Be transparent about compensation** -- Never hide referral fees or terms
3. **Offer educational content, not sales pitches** -- Partners guard their reputation
4. **Invite vetting** -- Confident operations welcome scrutiny
5. **Follow through on every commitment** -- One missed follow-up destroys trust
6. **Document everything in Lark Base** -- Every interaction, every introduction, every fee
`
  },
  {
    id: 'sm-buyer-funnel',
    roleId: 'referral-partner',
    title: 'Buyer Acquisition Funnel Workflow',
    type: 'checklist',
    content: `## Buyer Acquisition Funnel Workflow

### FUNNEL OVERVIEW

STAGES: AWARENESS -> INTEREST -> CONSIDERATION -> DECISION -> RETENTION

Tactics by stage:
- AWARENESS: Landing Pages, Social Media, Events, Referrals, Lead Magnets
- INTEREST: Email Sequences, Case Studies, Webinars, Deal Alerts, Nurture
- CONSIDERATION: Qualification Forms, DD Packages, Buyer Criteria, NDA/POF
- DECISION: LOI Submission, Signing, Wire/Title, Recording, Closing
- RETENTION: Monthly Reports, Deal Alerts, Referral Program, Events, Community

---

### STAGE 1: AWARENESS -- Lead Generation
**Goal**: Capture contact information from potential buyers
**KPIs**: Landing page visitors, form submissions, cost per lead

**TACTICS:**
- [ ] "Note Investing 101" lead magnet landing page
- [ ] Facebook/Instagram ads targeting real estate investors
- [ ] SEO blog content ("What is a mortgage note?", "Note investing vs rentals")
- [ ] Podcast guest appearances on real estate shows
- [ ] YouTube educational videos
- [ ] REI meetup presentations (partner events)
- [ ] Referral partner introductions

**AUTOMATION:**
- Form submission -> Lark Base "Buyer Pool" (Status: New Lead)
- Trigger: Welcome Email Sequence (Day 0)
- Alert posted to #buyer-leads channel

**CONVERSION TARGET**: 15-25% of landing page visitors submit the form

---

### STAGE 2: INTEREST -- Nurture & Educate
**Goal**: Build trust and educate prospects about note investing
**KPIs**: Email open rates, click-through rates, content engagement

**TACTICS:**
- [ ] 30-day Welcome Email Sequence (6 emails)
- [ ] Weekly "Deal of the Week" email to entire list
- [ ] Monthly educational webinar (co-hosted with partners)
- [ ] Case study content (real buyer stories with actual numbers)
- [ ] "Note Investing 101" video series

**AUTOMATION:**
- Email Day 7: If clicked "Schedule Call" -> Tag: "High Intent"
- Email Day 14: If no opens -> Re-engagement sequence
- Webinar attendance -> Tag: "Engaged" + Special follow-up sequence

**CONVERSION TARGET**: 20-30% of leads open >50% of emails

---

### STAGE 3: CONSIDERATION -- Qualify & Evaluate
**Goal**: Separate curious browsers from serious buyers
**KPIs**: Qualified buyer rate, NDA execution rate, DD package requests

**QUALIFICATION CRITERIA:**
- [ ] Accredited investor status (self-declared or verified)
- [ ] Minimum liquidity of $50K+
- [ ] Completed buyer criteria form
- [ ] Scheduled and completed welcome call
- [ ] NDA executed
- [ ] Proof of funds provided (for deals >$50K)

**TACTICS:**
- [ ] 15-minute welcome call (buyer relations)
- [ ] Buyer qualification form (LP #3)
- [ ] NDA execution via DocuSign
- [ ] Proof of funds request
- [ ] Blind deal summary presentation
- [ ] Full due diligence package delivery

**AUTOMATION:**
- Qualification form submitted -> Status updated to "Contacted"
- Welcome call scheduled automatically (Calendly integration)
- Post-call: Status -> "Qualified" or "Nurture"

**CONVERSION TARGET**: 10-15% of leads become qualified buyers

---

### STAGE 4: DECISION -- Close the Deal
**Goal**: Convert qualified buyers into closed transactions
**KPIs**: LOI submission rate, closing rate, days from LOI to close

**CLOSING PROCESS:**
- [ ] Blind summary presented (yield, LTV, payment history)
- [ ] 48-hour exclusive review window
- [ ] NDA executed (if not already)
- [ ] Full DD package delivered (title, comps, payment history)
- [ ] LOI submitted and accepted
- [ ] Assignment agreement signed
- [ ] Wire transfer initiated and CLEARED
- [ ] Assignment recorded with county
- [ ] Original note delivered to buyer
- [ ] Borrower notification sent
- [ ] First payment redirected to buyer

**AUTOMATION:**
- LOI accepted -> Operations team notified -> Closing timeline created
- Wire received -> Title company notified -> Recording scheduled
- Recording confirmed -> Buyer notification sent -> Status: "Closed-Won"
- Referral fee triggered (if applicable) -> Finance team notified

**CONVERSION TARGET**: 30-50% of qualified buyers close within 90 days

---

### STAGE 5: RETENTION -- Repeat Business & Referrals
**Goal**: Turn one-time buyers into repeat buyers and referral sources
**KPIs**: Repeat purchase rate, buyer satisfaction, referral rate

**RETENTION TACTICS:**
- [ ] Monthly payment performance reports
- [ ] Quarterly portfolio review calls
- [ ] First-look access to new deals (before public announcement)
- [ ] "Refer a Friend" program ($500 per closed referral)
- [ ] Annual buyer appreciation event
- [ ] Exclusive market insights newsletter

**AUTOMATION:**
- 30 days post-close -> Satisfaction survey
- 60 days post-close -> "How are your payments going?" check-in
- 90 days post-close -> New deal alert (personalized)
- 1 year post-close -> Anniversary note + exclusive offer

**CONVERSION TARGET**: 40%+ of buyers make a second purchase within 12 months

---

### FUNNEL METRICS DASHBOARD

Track these in Lark Base or your analytics tool:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Landing Page Conversion | 15-25% | Form submits / Page visits |
| Cost Per Lead | <$50 | Total ad spend / Leads generated |
| Lead-to-Qualified Rate | 10-15% | Qualified buyers / Total leads |
| Qualified-to-LOI Rate | 30-40% | LOIs submitted / Qualified buyers |
| LOI-to-Close Rate | 60-80% | Closed deals / LOIs submitted |
| Average Days to Close | <21 days | From LOI to funding |
| Repeat Buyer Rate | >40% | 2nd+ purchase buyers / Total buyers |
| Referral Rate | >20% | Buyers who refer / Total buyers |
| Net Promoter Score | >50 | Buyer satisfaction survey |

### MONTHLY FUNNEL REVIEW CHECKLIST

Every month, review:
- [ ] Total leads generated (by source)
- [ ] Lead quality score (engagement + qualification rate)
- [ ] Conversion rates at each funnel stage
- [ ] Top performing landing pages and content
- [ ] Email sequence performance (opens, clicks, conversions)
- [ ] Referral partner activity and results
- [ ] Cost per acquisition by channel
- [ ] Bottlenecks -- where are leads getting stuck?
- [ ] Action items for next month
`
  },
  {
    id: 'sm-events-playbook',
    roleId: 'referral-partner',
    title: 'Events & Networking Playbook',
    type: 'checklist',
    content: `## Events & Networking Playbook

### EVENT TYPES & STRATEGY

**REI MEETUPS** (Highest ROI)
- Target: Local real estate investor meetups within 100 miles of Chillicothe
- Frequency: 2-4 presentations per month
- Cost: $50-200 (food sponsorship)
- Expected ROI: 3-8 qualified leads per event
- Best for: Building buyer network, finding referral partners

**SEMINARS & WORKSHOPS**
- Target: Half-day educational events (co-hosted with CPA or attorney)
- Frequency: 1 per quarter
- Cost: $500-1,500 (venue, materials, food)
- Expected ROI: 10-20 qualified leads per event
- Best for: Deep education, establishing authority, premium buyer acquisition

**WEBINARS**
- Target: Broader geographic reach
- Frequency: 1 per month
- Cost: $0-100 (software)
- Expected ROI: 15-30 leads per webinar (lower intent than in-person)
- Best for: Scalable lead generation, partner co-promotion

**TRADE SHOWS & EXPOS**
- Target: Regional real estate expos
- Frequency: 2-3 per year
- Cost: $500-2,000 (booth, materials)
- Expected ROI: 20-50 leads per show
- Best for: Brand awareness, institutional buyer connections

---

### PRE-EVENT CHECKLIST

**2 Weeks Before:**
- [ ] Confirm event date, time, location with organizer
- [ ] Prepare presentation slides (educational, not sales)
- [ ] Print handouts (Note Evaluation Checklist, company one-pager)
- [ ] Order business cards and branded materials
- [ ] Prepare lead capture form (tablet or paper)
- [ ] Confirm food/beverage sponsorship arrangements
- [ ] Post event on social media (your channels + organizer's)

**1 Week Before:**
- [ ] Send reminder email to your list about the event
- [ ] Prepare follow-up email templates
- [ ] Charge tablets/laptops
- [ ] Print extra materials (always bring 25% more than expected attendance)
- [ ] Prepare "special offer" for attendees (free consultation, priority deal access)

**Day Before:**
- [ ] Confirm attendance numbers with organizer
- [ ] Prepare travel/logistics
- [ ] Send yourself presentation backup (email, cloud drive, USB)
- [ ] Prepare intro/outro talking points
- [ ] Set up Lark Base event record in "Events & Outreach" table

---

### PRESENTATION STRUCTURE (45-Minute Format)

**MINUTES 0-5: INTRODUCTION**
- Who you are (30 seconds)
- What NoteWorthy Capital does (1 minute)
- What attendees will learn today (30 seconds)
- Housekeeping: "This is educational -- zero sales pitch" (30 seconds)

**MINUTES 5-15: WHAT IS A MORTGAGE NOTE?**
- Simple explanation with analogy ("You become the bank")
- How notes differ from rental properties
- Types of notes (performing vs. non-performing)
- Why notes make sense for passive income investors

**MINUTES 15-30: CASE STUDY WALKTHROUGH**
- Present one real (or anonymized) deal
- Show the numbers: UPB, payment, yield, LTV
- Walk through the closing process
- Show what the buyer's monthly statement looks like
- Q&A during this section

**MINUTES 30-40: THE 5 METRICS**
- LTV (Loan-to-Value)
- Payment history
- Property type and condition
- Borrower credit profile
- State foreclosure laws
- Hand out the Note Evaluation Checklist

**MINUTES 40-45: HOW TO GET STARTED**
- Minimum investment ($50K+)
- Buyer qualification process
- How to join the qualified buyer list
- Special offer for attendees
- Final Q&A

---

### LEAD CAPTURE AT EVENTS

**Method**: Tablet-based form or QR code to landing page

**Minimum Info to Collect:**
- Name
- Email
- Phone
- Are you currently a real estate investor? (Y/N)
- Interested in: (A) Buying notes (B) Learning more (C) Referral partnership

**Follow-Up Timeline:**
- Within 2 hours: Thank-you email + presentation slides
- Day 1: "Nice meeting you" personal email to engaged attendees
- Day 3: Add to appropriate email sequence (buyer nurture or partner nurture)
- Day 7: Check-in call for "hot" leads who expressed immediate interest
- Day 14: Event photos/recap + soft CTA

---

### POST-EVENT FOLLOW-UP SEQUENCE

**EMAIL 1 -- Thank You + Slides (Same Day)**
Subject: Thanks for joining us at [Event Name] -- your slides are inside

**EMAIL 2 -- Additional Resource (Day 3)**
Subject: The Note Evaluation Checklist we mentioned at [Event Name]

**EMAIL 3 -- Soft CTA (Day 7)**
Subject: Ready to explore note investing further?

**EMAIL 4 -- Next Event Invite (Day 14)**
Subject: Join us at our next event -- [Date/Location]

---

### NETWORKING BEST PRACTICES

1. **Listen more than you talk** -- Ask about their investments first
2. **Take notes** -- Write down details about each conversation on their business card
3. **Follow up within 48 hours** -- Memory fades fast
4. **Add value first** -- Share an article, make an introduction, offer advice
5. **Track everything in Lark Base** -- Every contact, every conversation, every commitment
6. **Be consistent** -- Attend the same meetups regularly to build recognition
7. **Dress professionally** -- Business casual, branded polo or name tag
8. **Bring a wingman** -- Two people from your team can cover more ground
`
  },
];

export function getReferralMaterialsByRoleId(roleId: string): StudyMaterial[] {
  return referralMaterials.filter(s => s.roleId === roleId);
}
