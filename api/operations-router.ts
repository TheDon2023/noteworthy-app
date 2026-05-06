import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { sellers, buyers, deals, activities } from "@db/schema";
import { eq, desc } from "drizzle-orm";
import { memoryStore } from "./data/memoryStore";

// Helper: try DB, fallback to memory
async function withFallback<T>(dbFn: () => Promise<T>, fallbackFn: () => T): Promise<T> {
  try {
    return await dbFn();
  } catch {
    return fallbackFn();
  }
}

export const operationsRouter = createRouter({
  // ========== SELLERS ==========
  sellerCreate: publicQuery
    .input(z.object({
      fullName: z.string().min(1),
      email: z.string().optional(),
      phone: z.string().optional(),
      propertyAddress: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      noteType: z.string().optional(),
      upb: z.string().optional(),
      interestRate: z.string().optional(),
      monthlyPayment: z.string().optional(),
      remainingTerm: z.string().optional(),
      ltv: z.string().optional(),
      source: z.string().min(1),
      priority: z.string().default("medium"),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return withFallback(
        async () => {
          const [result] = await getDb().insert(sellers).values({
            fullName: input.fullName,
            email: input.email || null,
            phone: input.phone || null,
            propertyAddress: input.propertyAddress || null,
            city: input.city || null,
            state: input.state || null,
            noteType: input.noteType || null,
            upb: input.upb || null,
            interestRate: input.interestRate || null,
            monthlyPayment: input.monthlyPayment || null,
            remainingTerm: input.remainingTerm || null,
            ltv: input.ltv || null,
            source: input.source,
            priority: input.priority,
            notes: input.notes || null,
          }).$returningId();
          const row = await getDb().query.sellers.findFirst({ where: eq(sellers.id, result.id) });
          return row!;
        },
        () => memoryStore.createSeller({
          fullName: input.fullName,
          email: input.email || null,
          phone: input.phone || null,
          propertyAddress: input.propertyAddress || null,
          city: input.city || null,
          state: input.state || null,
          noteType: input.noteType || null,
          upb: input.upb || null,
          interestRate: input.interestRate || null,
          monthlyPayment: input.monthlyPayment || null,
          remainingTerm: input.remainingTerm || null,
          ltv: input.ltv || null,
          source: input.source,
          status: "new-lead",
          priority: input.priority,
          notes: input.notes || null,
          nextFollowUp: null,
        })
      );
    }),

  sellerList: publicQuery.query(async () => {
    return withFallback(
      async () => getDb().query.sellers.findMany({ orderBy: [desc(sellers.createdAt)] }),
      () => memoryStore.getSellers()
    );
  }),

  sellerUpdate: publicQuery
    .input(z.object({
      id: z.number(),
      fullName: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      propertyAddress: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      noteType: z.string().optional(),
      upb: z.string().optional(),
      interestRate: z.string().optional(),
      monthlyPayment: z.string().optional(),
      remainingTerm: z.string().optional(),
      ltv: z.string().optional(),
      source: z.string().optional(),
      status: z.string().optional(),
      priority: z.string().optional(),
      notes: z.string().optional(),
      nextFollowUp: z.date().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const updateData = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
      return withFallback(
        async () => {
          await getDb().update(sellers).set(updateData).where(eq(sellers.id, id));
          return getDb().query.sellers.findFirst({ where: eq(sellers.id, id) });
        },
        () => memoryStore.updateSeller(id, updateData as any)
      );
    }),

  sellerDelete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return withFallback(
        async () => { await getDb().delete(sellers).where(eq(sellers.id, input.id)); return true; },
        () => memoryStore.deleteSeller(input.id)
      );
    }),

  // ========== BUYERS ==========
  buyerCreate: publicQuery
    .input(z.object({
      fullName: z.string().min(1),
      company: z.string().optional(),
      title: z.string().optional(),
      email: z.string().email(),
      phone: z.string().optional(),
      linkedInUrl: z.string().optional(),
      category: z.string().min(1),
      tier: z.string().default("C"),
      sourceChannel: z.string().min(1),
      preferredStates: z.string().optional(),
      minUpb: z.string().optional(),
      maxUpb: z.string().optional(),
      targetYield: z.string().optional(),
      maxLtv: z.string().optional(),
      notePreference: z.string().optional(),
      propertyTypes: z.string().optional(),
      pofAmount: z.string().optional(),
      ndaStatus: z.string().default("not-sent"),
      accreditedInvestor: z.number().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return withFallback(
        async () => {
          const [result] = await getDb().insert(buyers).values({
            fullName: input.fullName,
            company: input.company || null,
            title: input.title || null,
            email: input.email,
            phone: input.phone || null,
            linkedInUrl: input.linkedInUrl || null,
            category: input.category,
            tier: input.tier,
            sourceChannel: input.sourceChannel,
            preferredStates: input.preferredStates || null,
            minUpb: input.minUpb || null,
            maxUpb: input.maxUpb || null,
            targetYield: input.targetYield || null,
            maxLtv: input.maxLtv || null,
            notePreference: input.notePreference || null,
            propertyTypes: input.propertyTypes || null,
            pofAmount: input.pofAmount || null,
            ndaStatus: input.ndaStatus,
            accreditedInvestor: input.accreditedInvestor ?? null,
            notes: input.notes || null,
          }).$returningId();
          const row = await getDb().query.buyers.findFirst({ where: eq(buyers.id, result.id) });
          return row!;
        },
        () => memoryStore.createBuyer({
          fullName: input.fullName,
          company: input.company || null,
          title: input.title || null,
          email: input.email,
          phone: input.phone || null,
          linkedInUrl: input.linkedInUrl || null,
          category: input.category,
          status: "prospect",
          tier: input.tier,
          sourceChannel: input.sourceChannel,
          preferredStates: input.preferredStates || null,
          minUpb: input.minUpb || null,
          maxUpb: input.maxUpb || null,
          targetYield: input.targetYield || null,
          maxLtv: input.maxLtv || null,
          notePreference: input.notePreference || null,
          propertyTypes: input.propertyTypes || null,
          proofOfFunds: null,
          pofAmount: input.pofAmount || null,
          pofDate: null,
          ndaStatus: input.ndaStatus,
          ndaSignedDate: null,
          accreditedInvestor: input.accreditedInvestor ?? null,
          notes: input.notes || null,
          lastContactDate: null,
        })
      );
    }),

  buyerList: publicQuery.query(async () => {
    return withFallback(
      async () => getDb().query.buyers.findMany({ orderBy: [desc(buyers.createdAt)] }),
      () => memoryStore.getBuyers()
    );
  }),

  buyerUpdate: publicQuery
    .input(z.object({
      id: z.number(),
      fullName: z.string().optional(),
      company: z.string().optional(),
      title: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      category: z.string().optional(),
      status: z.string().optional(),
      tier: z.string().optional(),
      preferredStates: z.string().optional(),
      minUpb: z.string().optional(),
      maxUpb: z.string().optional(),
      targetYield: z.string().optional(),
      maxLtv: z.string().optional(),
      notePreference: z.string().optional(),
      ndaStatus: z.string().optional(),
      accreditedInvestor: z.number().optional(),
      notes: z.string().optional(),
      lastContactDate: z.date().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const updateData = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
      return withFallback(
        async () => {
          await getDb().update(buyers).set(updateData).where(eq(buyers.id, id));
          return getDb().query.buyers.findFirst({ where: eq(buyers.id, id) });
        },
        () => memoryStore.updateBuyer(id, updateData as any)
      );
    }),

  buyerDelete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return withFallback(
        async () => { await getDb().delete(buyers).where(eq(buyers.id, input.id)); return true; },
        () => memoryStore.deleteBuyer(input.id)
      );
    }),

  // ========== DEALS ==========
  dealCreate: publicQuery
    .input(z.object({
      name: z.string().min(1),
      sellerId: z.number().optional(),
      propertyAddress: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      noteType: z.string().optional(),
      upb: z.string().optional(),
      assignmentPrice: z.string().optional(),
      monthlyPayment: z.string().optional(),
      interestRate: z.string().optional(),
      ltv: z.string().optional(),
      yield: z.string().optional(),
      stage: z.string().default("sourcing"),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return withFallback(
        async () => {
          const [result] = await getDb().insert(deals).values({
            name: input.name,
            sellerId: input.sellerId || null,
            propertyAddress: input.propertyAddress || null,
            city: input.city || null,
            state: input.state || null,
            noteType: input.noteType || null,
            upb: input.upb || null,
            assignmentPrice: input.assignmentPrice || null,
            monthlyPayment: input.monthlyPayment || null,
            interestRate: input.interestRate || null,
            ltv: input.ltv || null,
            yield: input.yield || null,
            stage: input.stage,
            notes: input.notes || null,
          }).$returningId();
          const row = await getDb().query.deals.findFirst({ where: eq(deals.id, result.id) });
          return row!;
        },
        () => memoryStore.createDeal({
          name: input.name,
          sellerId: input.sellerId || null,
          buyerId: null,
          propertyAddress: input.propertyAddress || null,
          city: input.city || null,
          state: input.state || null,
          noteType: input.noteType || null,
          upb: input.upb || null,
          assignmentPrice: input.assignmentPrice || null,
          monthlyPayment: input.monthlyPayment || null,
          interestRate: input.interestRate || null,
          ltv: input.ltv || null,
          yield: input.yield || null,
          status: "active",
          stage: input.stage,
          earnestDeposit: null,
          closingDate: null,
          notes: input.notes || null,
        })
      );
    }),

  dealList: publicQuery.query(async () => {
    return withFallback(
      async () => getDb().query.deals.findMany({ orderBy: [desc(deals.createdAt)] }),
      () => memoryStore.getDeals()
    );
  }),

  dealUpdate: publicQuery
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      sellerId: z.number().optional(),
      buyerId: z.number().optional(),
      propertyAddress: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      noteType: z.string().optional(),
      upb: z.string().optional(),
      assignmentPrice: z.string().optional(),
      monthlyPayment: z.string().optional(),
      interestRate: z.string().optional(),
      ltv: z.string().optional(),
      yield: z.string().optional(),
      stage: z.string().optional(),
      status: z.string().optional(),
      earnestDeposit: z.string().optional(),
      closingDate: z.date().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const updateData = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined));
      return withFallback(
        async () => {
          await getDb().update(deals).set(updateData).where(eq(deals.id, id));
          return getDb().query.deals.findFirst({ where: eq(deals.id, id) });
        },
        () => memoryStore.updateDeal(id, updateData as any)
      );
    }),

  dealDelete: publicQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return withFallback(
        async () => { await getDb().delete(deals).where(eq(deals.id, input.id)); return true; },
        () => memoryStore.deleteDeal(input.id)
      );
    }),

  // ========== ACTIVITIES ==========
  activityCreate: publicQuery
    .input(z.object({
      entityType: z.string().min(1),
      entityId: z.number(),
      activityType: z.string().min(1),
      subject: z.string().optional(),
      description: z.string().optional(),
      outcome: z.string().optional(),
      followUpDate: z.date().optional(),
    }))
    .mutation(async ({ input }) => {
      return withFallback(
        async () => {
          const [result] = await getDb().insert(activities).values({
            entityType: input.entityType,
            entityId: input.entityId,
            activityType: input.activityType,
            subject: input.subject || null,
            description: input.description || null,
            outcome: input.outcome || null,
            followUpDate: input.followUpDate || null,
          }).$returningId();
          const row = await getDb().query.activities.findFirst({ where: eq(activities.id, result.id) });
          return row!;
        },
        () => memoryStore.createActivity({
          entityType: input.entityType,
          entityId: input.entityId,
          activityType: input.activityType,
          subject: input.subject || null,
          description: input.description || null,
          outcome: input.outcome || null,
          followUpDate: input.followUpDate || null,
        })
      );
    }),

  activityList: publicQuery
    .input(z.object({ entityType: z.string().optional(), entityId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      return withFallback(
        async () => {
          if (input?.entityType && input?.entityId) {
            return getDb().query.activities.findMany({
              where: eq(activities.entityType, input.entityType) && eq(activities.entityId, input.entityId),
              orderBy: [desc(activities.createdAt)],
            });
          }
          return getDb().query.activities.findMany({ orderBy: [desc(activities.createdAt)] });
        },
        () => memoryStore.getActivities(input?.entityType, input?.entityId)
      );
    }),

  // ========== DASHBOARD SUMMARY ==========
  crmSummary: publicQuery.query(async () => {
    return withFallback(
      async () => {
        const allSellers = await getDb().query.sellers.findMany();
        const allBuyers = await getDb().query.buyers.findMany();
        const allDeals = await getDb().query.deals.findMany();
        const allActivities = await getDb().query.activities.findMany();
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
          totalActivities: allActivities.length,
          sellerByStatus,
          buyerByStatus,
          dealByStage,
        };
      },
      () => memoryStore.getCrmSummary()
    );
  }),
});
