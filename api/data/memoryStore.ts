// In-memory storage fallback when database is unavailable

// ==========================================
// TYPES
// ==========================================

export interface MemoryConversation {
  id: number;
  userId: number;
  scenarioId: string;
  roleId: string;
  personaName: string;
  personaTitle: string;
  context: string;
  status: string;
  startedAt: Date;
  endedAt: Date | null;
  messages: Array<{ id: number; conversationId: number; role: string; text: string; createdAt: Date }>;
}

export interface MemoryResult {
  id: number;
  userId: number;
  conversationId: number;
  scenarioId: string;
  roleId: string;
  overallScore: number;
  coachingPoints: string;
  timeSpent: number;
  completedAt: Date;
}

export interface MemorySeller {
  id: number; fullName: string; email: string | null; phone: string | null;
  propertyAddress: string | null; city: string | null; state: string | null;
  noteType: string | null; upb: string | null; interestRate: string | null;
  monthlyPayment: string | null; remainingTerm: string | null; ltv: string | null;
  source: string; status: string; priority: string; notes: string | null;
  nextFollowUp: Date | null; createdAt: Date; updatedAt: Date;
}

export interface MemoryBuyer {
  id: number; fullName: string; company: string | null; title: string | null;
  email: string; phone: string | null; linkedInUrl: string | null;
  category: string; status: string; tier: string; sourceChannel: string;
  preferredStates: string | null; minUpb: string | null; maxUpb: string | null;
  targetYield: string | null; maxLtv: string | null; notePreference: string | null;
  propertyTypes: string | null; proofOfFunds: string | null; pofAmount: string | null;
  pofDate: Date | null; ndaStatus: string; ndaSignedDate: Date | null;
  accreditedInvestor: number | null; notes: string | null; lastContactDate: Date | null;
  createdAt: Date; updatedAt: Date;
}

export interface MemoryDeal {
  id: number; name: string; sellerId: number | null; buyerId: number | null;
  propertyAddress: string | null; city: string | null; state: string | null;
  noteType: string | null; upb: string | null; assignmentPrice: string | null;
  monthlyPayment: string | null; interestRate: string | null; ltv: string | null;
  yield: string | null; status: string; stage: string; earnestDeposit: string | null;
  closingDate: Date | null; notes: string | null; createdAt: Date; updatedAt: Date;
}

export interface MemoryActivity {
  id: number; entityType: string; entityId: number; activityType: string;
  subject: string | null; description: string | null; outcome: string | null;
  followUpDate: Date | null; createdAt: Date;
}

// ==========================================
// CONVERSATION STORAGE
// ==========================================

let nextConvId = 1;
let nextMsgId = 1;
let nextResultId = 1;
const conversations: MemoryConversation[] = [];
const results: MemoryResult[] = [];

// ==========================================
// CRM STORAGE
// ==========================================

let nextSellerId = 1;
let nextBuyerId = 1;
let nextDealId = 1;
let nextActivityId = 1;
const sellers: MemorySeller[] = [];
const buyers: MemoryBuyer[] = [];
const deals: MemoryDeal[] = [];
const crmActivities: MemoryActivity[] = [];

// ==========================================
// CRM MEMORY STORE
// ==========================================

const crmMemoryStore = {
  createSeller(data: Omit<MemorySeller, 'id' | 'createdAt' | 'updatedAt'>) {
    const seller: MemorySeller = { ...data, id: nextSellerId++, createdAt: new Date(), updatedAt: new Date() };
    sellers.push(seller);
    return seller;
  },
  getSellers() {
    return [...sellers].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  getSeller(id: number) {
    return sellers.find(s => s.id === id) || null;
  },
  updateSeller(id: number, data: Partial<MemorySeller>) {
    const idx = sellers.findIndex(s => s.id === id);
    if (idx === -1) return null;
    sellers[idx] = { ...sellers[idx], ...data, updatedAt: new Date() };
    return sellers[idx];
  },
  deleteSeller(id: number) {
    const idx = sellers.findIndex(s => s.id === id);
    if (idx === -1) return false;
    sellers.splice(idx, 1);
    return true;
  },

  createBuyer(data: Omit<MemoryBuyer, 'id' | 'createdAt' | 'updatedAt'>) {
    const buyer: MemoryBuyer = { ...data, id: nextBuyerId++, createdAt: new Date(), updatedAt: new Date() };
    buyers.push(buyer);
    return buyer;
  },
  getBuyers() {
    return [...buyers].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  getBuyer(id: number) {
    return buyers.find(b => b.id === id) || null;
  },
  updateBuyer(id: number, data: Partial<MemoryBuyer>) {
    const idx = buyers.findIndex(b => b.id === id);
    if (idx === -1) return null;
    buyers[idx] = { ...buyers[idx], ...data, updatedAt: new Date() };
    return buyers[idx];
  },
  deleteBuyer(id: number) {
    const idx = buyers.findIndex(b => b.id === id);
    if (idx === -1) return false;
    buyers.splice(idx, 1);
    return true;
  },

  createDeal(data: Omit<MemoryDeal, 'id' | 'createdAt' | 'updatedAt'>) {
    const deal: MemoryDeal = { ...data, id: nextDealId++, createdAt: new Date(), updatedAt: new Date() };
    deals.push(deal);
    return deal;
  },
  getDeals() {
    return [...deals].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  getDeal(id: number) {
    return deals.find(d => d.id === id) || null;
  },
  updateDeal(id: number, data: Partial<MemoryDeal>) {
    const idx = deals.findIndex(d => d.id === id);
    if (idx === -1) return null;
    deals[idx] = { ...deals[idx], ...data, updatedAt: new Date() };
    return deals[idx];
  },
  deleteDeal(id: number) {
    const idx = deals.findIndex(d => d.id === id);
    if (idx === -1) return false;
    deals.splice(idx, 1);
    return true;
  },

  createActivity(data: Omit<MemoryActivity, 'id' | 'createdAt'>) {
    const act: MemoryActivity = { ...data, id: nextActivityId++, createdAt: new Date() };
    crmActivities.push(act);
    return act;
  },
  getActivities(entityType?: string, entityId?: number) {
    let filtered = [...crmActivities].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    if (entityType) filtered = filtered.filter(a => a.entityType === entityType);
    if (entityId) filtered = filtered.filter(a => a.entityId === entityId);
    return filtered;
  },
  deleteActivity(id: number) {
    const idx = crmActivities.findIndex(a => a.id === id);
    if (idx === -1) return false;
    crmActivities.splice(idx, 1);
    return true;
  },

  getCrmSummary() {
    const sellerByStatus: Record<string, number> = {};
    const buyerByStatus: Record<string, number> = {};
    const dealByStage: Record<string, number> = {};
    sellers.forEach(s => { sellerByStatus[s.status] = (sellerByStatus[s.status] || 0) + 1; });
    buyers.forEach(b => { buyerByStatus[b.status] = (buyerByStatus[b.status] || 0) + 1; });
    deals.forEach(d => { dealByStage[d.stage] = (dealByStage[d.stage] || 0) + 1; });
    return {
      totalSellers: sellers.length, totalBuyers: buyers.length,
      totalDeals: deals.length, totalActivities: crmActivities.length,
      sellerByStatus, buyerByStatus, dealByStage,
    };
  },
};

// ==========================================
// MAIN MEMORY STORE (includes CRM)
// ==========================================

export const memoryStore = {
  createConversation(data: Omit<MemoryConversation, 'id' | 'messages' | 'startedAt' | 'endedAt' | 'status'>) {
    const conv: MemoryConversation = {
      ...data, id: nextConvId++, status: 'active', startedAt: new Date(), endedAt: null, messages: [],
    };
    conversations.push(conv);
    return conv;
  },

  addMessage(conversationId: number, role: string, text: string) {
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return null;
    const msg = { id: nextMsgId++, conversationId, role, text, createdAt: new Date() };
    conv.messages.push(msg);
    return msg;
  },

  getConversation(id: number) {
    return conversations.find(c => c.id === id) || null;
  },

  getMessages(conversationId: number) {
    const conv = conversations.find(c => c.id === conversationId);
    return conv?.messages || [];
  },

  endConversation(id: number) {
    const conv = conversations.find(c => c.id === id);
    if (conv) { conv.status = 'completed'; conv.endedAt = new Date(); }
    return conv || null;
  },

  saveResult(data: Omit<MemoryResult, 'id' | 'completedAt'>) {
    const result: MemoryResult = { ...data, id: nextResultId++, completedAt: new Date() };
    results.push(result);
    return result;
  },

  getResults() {
    return [...results].sort((a, b) => b.completedAt.getTime() - a.completedAt.getTime());
  },

  clear() {
    conversations.length = 0;
    results.length = 0;
    nextConvId = 1;
    nextMsgId = 1;
    nextResultId = 1;
  },

  // Include all CRM methods
  ...crmMemoryStore,
};
