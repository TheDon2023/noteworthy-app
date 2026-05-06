import { Hono } from "hono";
import { getDb } from "./queries/connection";
import { sellers, buyers, deals } from "@db/schema";
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

export default syncApp;
