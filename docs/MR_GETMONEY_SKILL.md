# Mr. GetMoney Integration Skill — NoteWorthy Capital App

**Version:** 1.0  
**App URL:** `https://affectionate-trust-production-6c3a.up.railway.app`  
**Auth:** `Authorization: Bearer <SYNC_TOKEN>`  
**Time Zone:** All business logic runs on Eastern Time (9 AM–5 PM, Mon–Fri)

---

## The Golden Rule

**Do NOT create new tables, new schemas, or new database structures.**  
Everything you need already exists. Use the endpoints below. If something is missing, ask before building.

---

## What Already Exists (Use These)

### Tables (Pre-Built)

| Table | What It Tracks | Key Fields |
|-------|----------------|------------|
| `users` | Employee accounts (OAuth login) | `id`, `name`, `email`, `avatar`, `role` |
| `employeeProfiles` | Work info per employee | `userId`, `jobRole`, `department`, `status`, `hireDate`, `notes` |
| `skillRatings` | Employee skill proficiency | `userId`, `skillArea`, `rating` (1–10), `assessedBy`, `assessmentDate`, `notes` |
| `trainingAssignments` | Training modules assigned | `userId`, `title`, `trainingType`, `relatedRole`, `relatedSkill`, `status`, `priority`, `assignedBy`, `dueDate`, `completedAt`, `completionNotes` |
| `scenarioResults` | AI call simulation scores | `userId`, `scenarioId`, `roleId`, `overallScore` (0–100), `coachingPoints`, `timeSpent`, `completedAt` |
| `conversations` + `messages` | AI mentor chat history | `userId`, `scenarioId`, `status`, `messages` |
| `sellers` | Seller leads CRM | `fullName`, `email`, `phone`, `propertyAddress`, `state`, `noteType`, `upb`, `status`, `priority`, `source` |
| `buyers` | Buyer pool CRM | `fullName`, `company`, `email`, `category`, `tier`, `status`, `preferredStates`, `pofAmount`, `ndaStatus`, `accreditedInvestor` |
| `deals` | Deal pipeline | `name`, `sellerId`, `buyerId`, `propertyAddress`, `upb`, `stage`, `status`, `closingDate` |
| `activities` | Interaction log | `entityType`, `entityId`, `activityType`, `subject`, `description`, `outcome`, `followUpDate` |

### Pre-Defined Skill Areas (Use These Exact Names)

When creating or reading `skillRatings`, use these exact `skillArea` strings:

- `seller-qualification`
- `buyer-vetting`
- `deal-structuring`
- `compliance`
- `negotiation`
- `closing`

When creating `trainingAssignments`, use these exact `trainingType` values:

- `scenario` — AI call simulation
- `study-material` — Read SOP/document
- `sop-review` — Review standard operating procedure
- `mentor-session` — 1-on-1 with AI mentor
- `daily-priority` — Mr. GetMoney's daily action plan

### Pre-Defined Job Roles (Use These Exact Names)

When reading `employeeProfiles.jobRole`:

- `acquisition`
- `underwriting`
- `legal`
- `buyer-relations`
- `operations`
- `buyer-pool`
- `referral-partner`

---

## The Decision Tree (Read This Every Morning)

```
EMPLOYEE LOGS IN (or opens app during 9AM–5PM ET)
        │
        ▼
┌─────────────────────────────────────────────┐
│ STEP 1: Pull the Daily Briefing              │
│ GET /api/sync/dailyBriefing/:userId          │
└─────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│ STEP 2: Check Skill Gaps First              │
│                                             │
│ IF briefing.today.skillGaps.length > 0      │
│    → employee is NOT qualified for real work │
│    → BLOCK all revenue-generating tasks      │
│    → ASSIGN training immediately             │
│    → Log activity: "Skill gap identified"    │
│    → STOP here. No real work today.          │
│                                             │
│ ELSE → Proceed to Step 3                   │
└─────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│ STEP 3: Check Company Health                 │
│ GET /api/sync/companyHealth                  │
│                                             │
│ Priority Order (highest revenue impact):     │
│                                             │
│ 1. buyerPoolLow = true?                     │
│    → "We need qualified buyers NOW"          │
│    → Task: Source investors, run buyer-pool  │
│      scenarios, LinkedIn outreach           │
│                                             │
│ 2. sellerLeadsLow = true?                   │
│    → "We need seller leads"                │
│    → Task: Cold call, direct mail, run       │
│      acquisition scenarios                  │
│                                             │
│ 3. dealsStalled = true?                     │
│    → "Deals are stuck in sourcing/marketing"│
│    → Task: Push deals forward, schedule     │
│      buyer presentations, practice closing   │
│                                             │
│ 4. noDealsClosing = true?                   │
│    → "Nothing in the closing pipeline"      │
│    → Task: Move deals to LOI, due diligence  │
│                                             │
│ 5. All good? → EARN or LEARN                │
│    → "What can we close today?"            │
│    → "What can you master?"                │
│    → Assign advanced scenarios or training   │
└─────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│ STEP 4: Push Daily Priority Back to App     │
│ POST /api/sync/dailyPriority                │
│                                             │
│ {                                           │
│   "userId": 1,                              │
│   "title": "Buyer Pool Critical — Source",  │
│   "description": "We have 3 qualified       │
│     buyers. Need 10. Priority: 1) LinkedIn │
│     outreach to IRA investors in Top 10      │
│     states, 2) Run Buyer Pool scenarios,    │
│     3) Schedule 2 POF verification calls",  │
│   "priority": "high",                        │
│   "relatedRole": "buyer-pool",               │
│   "relatedSkill": "buyer-vetting",           │
│   "trainingType": "daily-priority"           │
│ }                                           │
└─────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────┐
│ STEP 5: Log the Decision                     │
│ POST /api/sync/activityLog                   │
│                                             │
│ {                                           │
│   "userId": 1,                              │
│   "entityType": "employee",                  │
│   "entityId": 1,                             │
│   "activityType": "status-change",           │
│   "subject": "Daily Priority Assigned",      │
│   "description": "Buyer pool critical.      │
│     Assigned sourcing tasks.",               │
│   "outcome": "task-assigned"                 │
│ }                                           │
└─────────────────────────────────────────────┘
```

---

## Skill-Gating Rules (The Non-Negotiables)

Before assigning ANY real-world task, check the employee's skill tree:

| If Task Requires... | Check This Skill | Minimum Rating | If Below... |
|---------------------|------------------|----------------|-------------|
| Cold calling sellers | `seller-qualification` | ≥ 6/10 | Assign: seller-qualification scenario training |
| Vetting buyer POF | `buyer-vetting` | ≥ 6/10 | Assign: buyer-vetting SOP review |
| Structuring a deal | `deal-structuring` | ≥ 6/10 | Assign: deal-structuring mentor session |
| Reviewing compliance | `compliance` | ≥ 6/10 | Assign: compliance study-material |
| Price negotiation | `negotiation` | ≥ 6/10 | Assign: negotiation scenario training |
| Closing a deal | `closing` | ≥ 6/10 | Assign: closing scenario training |

**Skill Rating Scale (1–10):**
- 1–3: Beginner — Needs foundational training
- 4–5: Developing — Needs supervised practice
- 6–7: Competent — Can do real work with oversight
- 8–9: Proficient — Can work independently
- 10: Expert — Can mentor others

**Rule:** If ANY required skill is < 6, the task is **BLOCKED**. Training is assigned. Real work waits.

---

## The 5 Endpoint Recipes

### Recipe 1: Morning Check-In
```
GET /api/sync/dailyBriefing/:userId
→ Read everything
→ Check skillGaps
→ Check companyHealth.flags
→ Decide priority
→ Push dailyPriority
→ Log activity
```

### Recipe 2: Push Training for Skill Gap
```
POST /api/sync/trainingCreate
Body: {
  "userId": 1,
  "title": "Practice Seller Qualification — Extract UPB in 60 Seconds",
  "description": "Run 3 cold-call scenarios. Focus on getting UPB, interest rate, and motivation quickly. Score target: 70%+",
  "trainingType": "scenario",
  "relatedRole": "acquisition",
  "relatedSkill": "seller-qualification",
  "priority": "high",
  "assignedBy": "Mr. GetMoney"
}
→ Returns: { success: true, training: {...} }
```

### Recipe 3: Update Skill After Training Pass
```
POST /api/sync/skillRatingCreate
Body: {
  "userId": 1,
  "skillArea": "seller-qualification",
  "rating": 7,
  "assessedBy": "Mr. GetMoney",
  "notes": "Completed 3 scenarios with avg score 82%. Approved for live seller calls."
}
→ Returns: { success: true, skillRating: {...} }
```

### Recipe 4: Mark Training Complete
```
POST /api/sync/trainingStatusUpdate
Body: {
  "id": 5,
  "status": "completed",
  "completionNotes": "Passed all 3 scenarios with 82% avg. Skill upgraded to 7/10."
}
→ Returns: { success: true, training: {...} }
```

### Recipe 5: Log Real Work Activity
```
POST /api/sync/activityLog
Body: {
  "userId": 1,
  "entityType": "seller",
  "entityId": 12,
  "activityType": "call",
  "subject": "Cold call — motivated seller in Tampa",
  "description": "Spoke with John D. UPB $89K, 8% rate, 12 years remaining. Motivated — divorce situation. Scheduled follow-up.",
  "outcome": "interested",
  "followUpDate": "2026-05-09T14:00:00Z"
}
→ Returns: { success: true, activity: {...} }
```

---

## What NOT to Do

| Don't Do This | Why | What To Do Instead |
|---------------|-----|-------------------|
| Create new tables like `skills`, `employee_skills`, `training_modules` | These already exist as `skillRatings` and `trainingAssignments` | Use the existing endpoints |
| Create a new `skill_assessments` table | `skillRatings` already tracks assessmentDate, assessedBy, notes | Use `POST /api/sync/skillRatingCreate` |
| Create `training_completions` table | `trainingAssignments` has `status`, `completedAt`, `completionNotes` | Use `POST /api/sync/trainingStatusUpdate` |
| Build a separate auth system | OAuth via Kimi is already wired | Use `users` table, call `GET /api/sync/dailyBriefing/:userId` |
| Add new `jobRole` values | 7 roles are already defined | Use existing: acquisition, underwriting, legal, buyer-relations, operations, buyer-pool, referral-partner |
| Add new `skillArea` values | 6 core skills are already defined | Use existing: seller-qualification, buyer-vetting, deal-structuring, compliance, negotiation, closing |
| Use a different rating scale | We use 1–10 | Convert if needed, but store as 1–10 in `skillRatings.rating` |

---

## Quick Reference: All Sync Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/sync/sellerCreate` | POST | Push seller lead |
| `/api/sync/buyerCreate` | POST | Push buyer to CRM |
| `/api/sync/dealCreate` | POST | Push new deal |
| `/api/sync/crmSummary` | GET | Read CRM stats |
| `/api/sync/trainingCreate` | POST | Assign training |
| `/api/sync/skillRatingCreate` | POST | Rate a skill |
| `/api/sync/trainingStatusUpdate` | POST | Complete training |
| `/api/sync/employeeSummary` | GET | Team dashboard |
| `/api/sync/employee/:userId` | GET | Employee detail |
| `/api/sync/dailyBriefing/:userId` | GET | **Morning briefing** |
| `/api/sync/dailyPriority` | POST | Push action plan |
| `/api/sync/activityLog` | POST | Log work activity |
| `/api/sync/companyHealth` | GET | Company health check |

---

## Integration Checklist for Mr. GetMoney

- [ ] Confirm `SYNC_TOKEN` is set in Railway environment variables
- [ ] Confirm `dailyBriefing` returns `skillGaps`, `companyHealth.flags`, `priorityContext`
- [ ] Confirm skill-gating blocks tasks when `rating < 6`
- [ ] Confirm training assignments update `trainingAssignments` table
- [ ] Confirm skill upgrades go to `skillRatings` table
- [ ] Confirm activity logging goes to `activities` table
- [ ] Confirm daily priorities display on employee dashboard
- [ ] Confirm no new tables were created
- [ ] Confirm Eastern Time working hours (9AM–5PM, Mon–Fri)

---

**Built by:** NoteWorthy Capital Engineering  
**Last Updated:** 2026-05-08  
**Contact:** If something is missing, ask. Don't build around it.
