import { Hono } from "hono";
import { getDb } from "./queries/connection";
import { sellers, buyers, deals, employeeProfiles, skillRatings, trainingAssignments, users, scenarioResults } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { memoryStore } from "./data/memoryStore";
import { env } from "./lib/env";

const syncApp = new Hono();

// Auth middleware
syncApp.use("/*", async (c, next) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  if (!token || token !== env.syncToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
});

function withFallback<T>(dbFn: () => Promise<T>, fallbackFn: () => T): Promise<T> {
  return dbFn().catch(() => fallbackFn());
}

// ===== POST /api/sync/sellerCreate =====
syncApp.post("/sellerCreate", async (c) => {
  const body = await c.req.json();
  const result = await withFallback(
    async () => {
      const [inserted] = await getDb().insert(sellers).values({
        fullName: body.fullName,
        email: body.email || null,
        phone: body.phone || null,
        propertyAddress: body.propertyAddress || null,
        city: body.city || null,
        state: body.state || null,
        noteType: body.noteType || null,
        upb: body.upb || null,
        interestRate: body.interestRate || null,
        monthlyPayment: body.monthlyPayment || null,
        remainingTerm: body.remainingTerm || null,
        ltv: body.ltv || null,
        source: body.source || "api",
        priority: body.priority || "medium",
        notes: body.notes || null,
      }).$returningId();
      return getDb().query.sellers.findFirst({ where: eq(sellers.id, inserted.id) });
    },
    () => memoryStore.createSeller({
      fullName: body.fullName,
      email: body.email || null,
      phone: body.phone || null,
      propertyAddress: body.propertyAddress || null,
      city: body.city || null,
      state: body.state || null,
      noteType: body.noteType || null,
      upb: body.upb || null,
      interestRate: body.interestRate || null,
      monthlyPayment: body.monthlyPayment || null,
      remainingTerm: body.remainingTerm || null,
      ltv: body.ltv || null,
      source: body.source || "api",
      status: "new-lead",
      priority: body.priority || "medium",
      notes: body.notes || null,
      nextFollowUp: null,
    })
  );
  return c.json({ success: true, seller: result });
});

// ===== POST /api/sync/buyerCreate =====
syncApp.post("/buyerCreate", async (c) => {
  const body = await c.req.json();
  const result = await withFallback(
    async () => {
      const [inserted] = await getDb().insert(buyers).values({
        fullName: body.fullName,
        email: body.email,
        company: body.company || null,
        title: body.title || null,
        phone: body.phone || null,
        linkedInUrl: body.linkedInUrl || null,
        category: body.category || "private",
        tier: body.tier || "C",
        sourceChannel: body.sourceChannel || "api",
        preferredStates: body.preferredStates || null,
        minUpb: body.minUpb || null,
        maxUpb: body.maxUpb || null,
        targetYield: body.targetYield || null,
        maxLtv: body.maxLtv || null,
        notePreference: body.notePreference || null,
        propertyTypes: body.propertyTypes || null,
        pofAmount: body.pofAmount || null,
        ndaStatus: body.ndaStatus || "not-sent",
        accreditedInvestor: body.accreditedInvestor ?? null,
        notes: body.notes || null,
      }).$returningId();
      return getDb().query.buyers.findFirst({ where: eq(buyers.id, inserted.id) });
    },
    () => memoryStore.createBuyer({
      fullName: body.fullName,
      email: body.email,
      company: body.company || null,
      title: body.title || null,
      phone: body.phone || null,
      linkedInUrl: body.linkedInUrl || null,
      category: body.category || "private",
      status: "prospect",
      tier: body.tier || "C",
      sourceChannel: body.sourceChannel || "api",
      preferredStates: body.preferredStates || null,
      minUpb: body.minUpb || null,
      maxUpb: body.maxUpb || null,
      targetYield: body.targetYield || null,
      maxLtv: body.maxLtv || null,
      notePreference: body.notePreference || null,
      propertyTypes: body.propertyTypes || null,
      proofOfFunds: null,
      pofAmount: body.pofAmount || null,
      pofDate: null,
      ndaStatus: body.ndaStatus || "not-sent",
      ndaSignedDate: null,
      accreditedInvestor: body.accreditedInvestor ?? null,
      notes: body.notes || null,
      lastContactDate: null,
    })
  );
  return c.json({ success: true, buyer: result });
});

// ===== POST /api/sync/dealCreate =====
syncApp.post("/dealCreate", async (c) => {
  const body = await c.req.json();
  const result = await withFallback(
    async () => {
      const [inserted] = await getDb().insert(deals).values({
        name: body.name,
        sellerId: body.sellerId || null,
        propertyAddress: body.propertyAddress || null,
        city: body.city || null,
        state: body.state || null,
        noteType: body.noteType || null,
        upb: body.upb || null,
        assignmentPrice: body.assignmentPrice || null,
        monthlyPayment: body.monthlyPayment || null,
        interestRate: body.interestRate || null,
        ltv: body.ltv || null,
        yield: body.yield || null,
        stage: body.stage || "sourcing",
        notes: body.notes || null,
      }).$returningId();
      return getDb().query.deals.findFirst({ where: eq(deals.id, inserted.id) });
    },
    () => memoryStore.createDeal({
      name: body.name,
      sellerId: body.sellerId || null,
      buyerId: null,
      propertyAddress: body.propertyAddress || null,
      city: body.city || null,
      state: body.state || null,
      noteType: body.noteType || null,
      upb: body.upb || null,
      assignmentPrice: body.assignmentPrice || null,
      monthlyPayment: body.monthlyPayment || null,
      interestRate: body.interestRate || null,
      ltv: body.ltv || null,
      yield: body.yield || null,
      status: "active",
      stage: body.stage || "sourcing",
      earnestDeposit: null,
      closingDate: null,
      notes: body.notes || null,
    })
  );
  return c.json({ success: true, deal: result });
});

// ===== GET /api/sync/crmSummary =====
syncApp.get("/crmSummary", async (c) => {
  const result = await withFallback(
    async () => {
      const allSellers = await getDb().query.sellers.findMany();
      const allBuyers = await getDb().query.buyers.findMany();
      const allDeals = await getDb().query.deals.findMany();
      const sellerByStatus: Record<string, number> = {};
      const buyerByStatus: Record<string, number> = {};
      const dealByStage: Record<string, number> = {};
      allSellers.forEach(s => { sellerByStatus[s.status] = (sellerByStatus[s.status] || 0) + 1; });
      allBuyers.forEach(b => { buyerByStatus[b.status] = (buyerByStatus[b.status] || 0) + 1; });
      allDeals.forEach(d => { dealByStage[d.stage] = (dealByStage[d.stage] || 0) + 1; });
      return {
        totalSellers: allSellers.length,
        totalBuyers: allBuyers.length,
        totalDeals: allDeals.length,
        sellerByStatus,
        buyerByStatus,
        dealByStage,
      };
    },
    () => memoryStore.getCrmSummary()
  );
  return c.json({ success: true, summary: result });
});

// ============================================================
// EMPLOYEE TRACKING SYNC — Mr. GetMoney Integration
// ============================================================

// ===== POST /api/sync/trainingCreate =====
// Mr. GetMoney pushes training assignments to employees
syncApp.post("/trainingCreate", async (c) => {
  const body = await c.req.json();
  const result = await withFallback(
    async () => {
      const [inserted] = await getDb().insert(trainingAssignments).values({
        userId: body.userId,
        title: body.title,
        description: body.description || null,
        trainingType: body.trainingType || "mentor-session",
        relatedRole: body.relatedRole || null,
        relatedSkill: body.relatedSkill || null,
        priority: body.priority || "medium",
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        assignedBy: body.assignedBy || "Mr. GetMoney",
        status: "assigned",
      }).$returningId();
      return getDb().query.trainingAssignments.findFirst({
        where: eq(trainingAssignments.id, inserted.id),
      });
    },
    () => null
  );
  return c.json({ success: true, training: result });
});

// ===== POST /api/sync/skillRatingCreate =====
// Mr. GetMoney pushes skill assessments after analyzing performance
syncApp.post("/skillRatingCreate", async (c) => {
  const body = await c.req.json();
  const result = await withFallback(
    async () => {
      const [inserted] = await getDb().insert(skillRatings).values({
        userId: body.userId,
        skillArea: body.skillArea,
        rating: body.rating,
        assessedBy: body.assessedBy || "Mr. GetMoney",
        notes: body.notes || null,
      }).$returningId();
      return getDb().query.skillRatings.findFirst({
        where: eq(skillRatings.id, inserted.id),
      });
    },
    () => null
  );
  return c.json({ success: true, skillRating: result });
});

// ===== GET /api/sync/employeeSummary =====
// Mr. GetMoney reads full team dashboard data
syncApp.get("/employeeSummary", async (c) => {
  const result = await withFallback(
    async () => {
      const allUsers = await getDb().query.users.findMany();
      const profiles = await getDb().query.employeeProfiles.findMany();
      const allResults = await getDb().query.scenarioResults.findMany();
      const allSkills = await getDb().query.skillRatings.findMany();
      const allTrainings = await getDb().query.trainingAssignments.findMany();

      const profileMap = new Map(profiles.map(p => [p.userId, p]));

      return allUsers.map(u => {
        const userResults = allResults.filter(r => r.userId === u.id);
        const userSkills = allSkills.filter(s => s.userId === u.id);
        const userTrainings = allTrainings.filter(t => t.userId === u.id);
        const profile = profileMap.get(u.id);

        const avgScore = userResults.length > 0
          ? Math.round(userResults.reduce((sum, r) => sum + r.overallScore, 0) / userResults.length)
          : 0;
        const skillAvg = userSkills.length > 0
          ? Math.round(userSkills.reduce((sum, s) => sum + s.rating, 0) / userSkills.length)
          : 0;
        const completionRate = userTrainings.length > 0
          ? Math.round((userTrainings.filter(t => t.status === "completed").length / userTrainings.length) * 100)
          : 0;

        return {
          id: u.id,
          name: u.name || "Unknown",
          email: u.email,
          jobRole: profile?.jobRole || "Unassigned",
          status: profile?.status || "active",
          totalScenarios: userResults.length,
          avgScore,
          skillAvg,
          completionRate,
          pendingTrainings: userTrainings.filter(t => t.status === "assigned" || t.status === "in-progress").length,
          lastActive: userResults.length > 0
            ? userResults.sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))[0].completedAt
            : null,
        };
      });
    },
    () => []
  );
  return c.json({ success: true, employees: result });
});

// ===== GET /api/sync/employee/:userId =====
// Mr. GetMoney reads detailed employee performance
syncApp.get("/employee/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  if (isNaN(userId)) return c.json({ error: "Invalid userId" }, 400);

  const result = await withFallback(
    async () => {
      const user = await getDb().query.users.findFirst({
        where: eq(users.id, userId),
      });
      if (!user) return null;

      const profile = await getDb().query.employeeProfiles.findFirst({
        where: eq(employeeProfiles.userId, userId),
      });
      const results = await getDb().query.scenarioResults.findMany({
        where: eq(scenarioResults.userId, userId),
        orderBy: [desc(scenarioResults.completedAt)],
      });
      const skills = await getDb().query.skillRatings.findMany({
        where: eq(skillRatings.userId, userId),
        orderBy: [desc(skillRatings.assessmentDate)],
      });
      const trainings = await getDb().query.trainingAssignments.findMany({
        where: eq(trainingAssignments.userId, userId),
        orderBy: [desc(trainingAssignments.assignedAt)],
      });

      // Calculate role averages
      const roleScores: Record<string, number[]> = {};
      results.forEach(r => {
        if (!roleScores[r.roleId]) roleScores[r.roleId] = [];
        roleScores[r.roleId].push(r.overallScore);
      });
      const roleAverages = Object.entries(roleScores).map(([roleId, scores]) => ({
        roleId,
        avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
        attempts: scores.length,
      }));

      // Skill gaps (below 6)
      const skillMap: Record<string, number[]> = {};
      skills.forEach(s => {
        if (!skillMap[s.skillArea]) skillMap[s.skillArea] = [];
        skillMap[s.skillArea].push(s.rating);
      });
      const skillGaps = Object.entries(skillMap)
        .filter(([_, ratings]) => ratings.reduce((a, b) => a + b, 0) / ratings.length < 6)
        .map(([area]) => area);

      return {
        user: { id: user.id, name: user.name, email: user.email, avatar: user.avatar },
        profile,
        totalScenarios: results.length,
        overallAverage: results.length > 0
          ? Math.round(results.reduce((sum, r) => sum + r.overallScore, 0) / results.length)
          : 0,
        roleAverages,
        skillGaps,
        skills,
        trainings,
        results: results.slice(0, 10),
      };
    },
    () => null
  );
  return c.json({ success: true, employee: result });
});

// ===== POST /api/sync/trainingStatusUpdate =====
// Mr. GetMoney can mark training as completed or update status
syncApp.post("/trainingStatusUpdate", async (c) => {
  const body = await c.req.json();
  const result = await withFallback(
    async () => {
      const updateData: any = { status: body.status };
      if (body.status === "completed") {
        updateData.completedAt = new Date();
      }
      if (body.completionNotes) {
        updateData.completionNotes = body.completionNotes;
      }
      await getDb().update(trainingAssignments)
        .set(updateData)
        .where(eq(trainingAssignments.id, body.id));
      return getDb().query.trainingAssignments.findFirst({
        where: eq(trainingAssignments.id, body.id),
      });
    },
    () => null
  );
  return c.json({ success: true, training: result });
});

// ============================================================
// DAILY BRIEFING — Mr. GetMoney's Morning Brief
// ============================================================

function getETTimestamp(d: Date): string {
  return d.toLocaleString("en-US", { timeZone: "America/New_York" });
}

function isWithinWorkingHours(): boolean {
  const now = new Date();
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const hour = et.getHours();
  const day = et.getDay();
  return day >= 1 && day <= 5 && hour >= 9 && hour < 17; // Mon-Fri 9AM-5PM ET
}

// ===== GET /api/sync/dailyBriefing =====
// Mr. GetMoney pulls the full morning briefing for an employee
// Returns: yesterday's work, today's schedule, company health, gaps, priorities
syncApp.get("/dailyBriefing/:userId", async (c) => {
  const userId = parseInt(c.req.param("userId"));
  if (isNaN(userId)) return c.json({ error: "Invalid userId" }, 400);

  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const briefing = await withFallback(
    async () => {
      // --- EMPLOYEE DATA ---
      const user = await getDb().query.users.findFirst({
        where: eq(users.id, userId),
      });
      if (!user) return null;

      const profile = await getDb().query.employeeProfiles.findFirst({
        where: eq(employeeProfiles.userId, userId),
      });

      // Yesterday's completed scenarios
      const results = await getDb().query.scenarioResults.findMany({
        where: eq(scenarioResults.userId, userId),
        orderBy: [desc(scenarioResults.completedAt)],
      });
      const yesterdaysResults = results.filter(r => {
        const d = r.completedAt ? new Date(r.completedAt) : null;
        return d && d >= yesterday && d < now;
      });
      const olderResults = results.filter(r => {
        const d = r.completedAt ? new Date(r.completedAt) : null;
        return d && d < yesterday;
      });

      // Yesterday's training activity
      const allTrainings = await getDb().query.trainingAssignments.findMany({
        where: eq(trainingAssignments.userId, userId),
        orderBy: [desc(trainingAssignments.assignedAt)],
      });
      const trainingsCompletedYesterday = allTrainings.filter(t => {
        const d = t.completedAt ? new Date(t.completedAt) : null;
        return d && d >= yesterday;
      });
      const trainingsPending = allTrainings.filter(t =>
        t.status === "assigned" || t.status === "in-progress"
      );
      const trainingsOverdue = allTrainings.filter(t => {
        if (t.status === "completed") return false;
        if (!t.dueDate) return false;
        return new Date(t.dueDate) < now;
      });

      // Skill gaps
      const skills = await getDb().query.skillRatings.findMany({
        where: eq(skillRatings.userId, userId),
        orderBy: [desc(skillRatings.assessmentDate)],
      });
      const skillMap: Record<string, number[]> = {};
      skills.forEach(s => {
        if (!skillMap[s.skillArea]) skillMap[s.skillArea] = [];
        skillMap[s.skillArea].push(s.rating);
      });
      const skillGaps = Object.entries(skillMap)
        .filter(([_, ratings]) => ratings.reduce((a, b) => a + b, 0) / ratings.length < 6)
        .map(([area, ratings]) => ({
          skillArea: area,
          avgRating: Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length * 10) / 10,
        }));

      // --- COMPANY HEALTH ---
      const allSellers = await getDb().query.sellers.findMany();
      const allBuyers = await getDb().query.buyers.findMany();
      const allDeals = await getDb().query.deals.findMany();

      const sellerByStatus: Record<string, number> = {};
      allSellers.forEach(s => { sellerByStatus[s.status] = (sellerByStatus[s.status] || 0) + 1; });
      const buyerByStatus: Record<string, number> = {};
      allBuyers.forEach(b => { buyerByStatus[b.status] = (buyerByStatus[b.status] || 0) + 1; });
      const dealByStage: Record<string, number> = {};
      allDeals.forEach(d => { dealByStage[d.stage] = (dealByStage[d.stage] || 0) + 1; });

      // Priority flags for Mr. GetMoney
      const companyFlags = {
        buyerPoolLow: allBuyers.filter(b => b.status === "qualified" || b.status === "active").length < 10,
        sellerLeadsLow: allSellers.filter(s => s.status === "new-lead" || s.status === "contacted").length < 5,
        dealsStalled: allDeals.filter(d => d.stage === "sourcing" || d.stage === "marketing").length > 0 &&
          allDeals.filter(d => d.stage === "closing" || d.stage === "closed-won").length === 0,
        noDealsClosing: allDeals.filter(d => d.stage === "closing").length === 0,
      };

      // Working hours flag
      const inWorkingHours = isWithinWorkingHours();

      return {
        timestamp: now.toISOString(),
        etTime: getETTimestamp(now),
        inWorkingHours,
        employee: {
          id: user.id,
          name: user.name,
          email: user.email,
          jobRole: profile?.jobRole || "Unassigned",
          status: profile?.status || "active",
        },
        yesterday: {
          scenariosCompleted: yesterdaysResults.length,
          scenariosDetails: yesterdaysResults.map(r => ({
            scenarioId: r.scenarioId,
            roleId: r.roleId,
            overallScore: r.overallScore,
            timeSpent: r.timeSpent,
          })),
          trainingsCompleted: trainingsCompletedYesterday.length,
          trainingsDetails: trainingsCompletedYesterday.map(t => t.title),
          lastActive: results.length > 0
            ? results[0].completedAt
            : olderResults.length > 0 ? olderResults[0].completedAt : null,
          wasIdle: yesterdaysResults.length === 0 && trainingsCompletedYesterday.length === 0,
        },
        today: {
          pendingTrainings: trainingsPending.length,
          trainingsDetails: trainingsPending.map(t => ({
            id: t.id,
            title: t.title,
            priority: t.priority,
            status: t.status,
            dueDate: t.dueDate,
            overdue: t.dueDate ? new Date(t.dueDate) < now : false,
          })),
          overdueTrainings: trainingsOverdue.length,
          overdueDetails: trainingsOverdue.map(t => ({
            id: t.id,
            title: t.title,
            dueDate: t.dueDate,
          })),
          skillGaps,
          rolePerformance: (() => {
            const roleScores: Record<string, number[]> = {};
            results.forEach(r => {
              if (!roleScores[r.roleId]) roleScores[r.roleId] = [];
              roleScores[r.roleId].push(r.overallScore);
            });
            return Object.entries(roleScores).map(([roleId, scores]) => ({
              roleId,
              avgScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
              attempts: scores.length,
            }));
          })(),
        },
        companyHealth: {
          totalSellers: allSellers.length,
          totalBuyers: allBuyers.length,
          totalDeals: allDeals.length,
          sellerBreakdown: sellerByStatus,
          buyerBreakdown: buyerByStatus,
          dealBreakdown: dealByStage,
          flags: companyFlags,
        },
        priorityContext: {
          // These flags tell Mr. GetMoney what to prioritize
          employeeShouldTrain: skillGaps.length > 0 || trainingsPending.length > 0,
          employeeShouldSell: !companyFlags.sellerLeadsLow && companyFlags.buyerPoolLow,
          employeeShouldSource: companyFlags.sellerLeadsLow,
          employeeShouldClose: companyFlags.dealsStalled || companyFlags.noDealsClosing,
          idleTooLong: (() => {
            const lastActive = results.length > 0 ? new Date(results[0].completedAt!) : null;
            if (!lastActive) return true;
            return (now.getTime() - lastActive.getTime()) > 48 * 60 * 60 * 1000;
          })(),
        },
      };
    },
    () => null
  );
  return c.json({ success: true, briefing });
});

// ===== POST /api/sync/dailyPriority =====
// Mr. GetMoney pushes back the prioritized action plan for the employee
syncApp.post("/dailyPriority", async (c) => {
  const body = await c.req.json();
  const result = await withFallback(
    async () => {
      // Upsert the daily priority record — stored as a special training assignment
      // with type "daily-priority" so the UI can display it
      const [inserted] = await getDb().insert(trainingAssignments).values({
        userId: body.userId,
        title: body.title,
        description: body.description || null,
        trainingType: "daily-priority",
        relatedRole: body.relatedRole || null,
        relatedSkill: body.relatedSkill || null,
        priority: body.priority || "high",
        status: "assigned",
        assignedBy: "Mr. GetMoney",
        dueDate: body.dueDate ? new Date(body.dueDate) : new Date(),
      }).$returningId();
      return getDb().query.trainingAssignments.findFirst({
        where: eq(trainingAssignments.id, inserted.id),
      });
    },
    () => null
  );
  return c.json({ success: true, priority: result });
});

// ===== POST /api/sync/activityLog =====
// Log real-time activity so Mr. GetMoney tracks progress throughout the day
syncApp.post("/activityLog", async (c) => {
  const body = await c.req.json();
  const result = await withFallback(
    async () => {
      const { activities } = await import("@db/schema");
      const [inserted] = await getDb().insert(activities).values({
        entityType: body.entityType || "employee",
        entityId: body.entityId || body.userId,
        activityType: body.activityType,
        subject: body.subject || null,
        description: body.description || null,
        outcome: body.outcome || null,
        followUpDate: body.followUpDate ? new Date(body.followUpDate) : null,
      }).$returningId();
      return getDb().query.activities.findFirst({
        where: eq(activities.id, inserted.id),
      });
    },
    () => null
  );
  return c.json({ success: true, activity: result });
});

// ===== GET /api/sync/companyHealth =====
// Quick company-wide health check for Mr. GetMoney
syncApp.get("/companyHealth", async (c) => {
  const result = await withFallback(
    async () => {
      const allSellers = await getDb().query.sellers.findMany();
      const allBuyers = await getDb().query.buyers.findMany();
      const allDeals = await getDb().query.deals.findMany();
      const allTrainings = await getDb().query.trainingAssignments.findMany();

      const sellerByStatus: Record<string, number> = {};
      allSellers.forEach(s => { sellerByStatus[s.status] = (sellerByStatus[s.status] || 0) + 1; });
      const buyerByStatus: Record<string, number> = {};
      allBuyers.forEach(b => { buyerByStatus[b.status] = (buyerByStatus[b.status] || 0) + 1; });
      const dealByStage: Record<string, number> = {};
      allDeals.forEach(d => { dealByStage[d.stage] = (dealByStage[d.stage] || 0) + 1; });

      // Count employees active in last 24h
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const activeEmployees = await getDb().query.scenarioResults.findMany();
      const uniqueActiveToday = new Set(
        activeEmployees.filter(r =>
          r.completedAt && new Date(r.completedAt) >= twentyFourHoursAgo
        ).map(r => r.userId)
      ).size;

      return {
        timestamp: new Date().toISOString(),
        inWorkingHours: isWithinWorkingHours(),
        sellers: { total: allSellers.length, breakdown: sellerByStatus },
        buyers: { total: allBuyers.length, breakdown: buyerByStatus },
        deals: { total: allDeals.length, breakdown: dealByStage },
        team: {
          totalEmployees: (await getDb().query.users.findMany()).length,
          activeToday: uniqueActiveToday,
          pendingTrainings: allTrainings.filter(t =>
            t.status === "assigned" || t.status === "in-progress"
          ).length,
        },
        flags: {
          needsBuyers: allBuyers.filter(b => b.status === "qualified" || b.status === "active").length < 10,
          needsSellers: allSellers.filter(s => s.status === "new-lead" || s.status === "contacted").length < 5,
          dealsNeedClosing: allDeals.filter(d => d.stage === "closing").length === 0 && allDeals.length > 0,
          teamIdle: uniqueActiveToday === 0,
        },
      };
    },
    () => null
  );
  return c.json({ success: true, health: result });
});

export default syncApp;
