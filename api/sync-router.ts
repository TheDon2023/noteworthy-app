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

export default syncApp;
