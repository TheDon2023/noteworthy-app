import {
  mysqlTable,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  json,
  tinyint,
} from "drizzle-orm/mysql-core";

// Users table (auth already provided)
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: varchar("role", { length: 20 }).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Conversations - AI training sessions
export const conversations = mysqlTable("conversations", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  scenarioId: varchar("scenarioId", { length: 100 }).notNull(),
  roleId: varchar("roleId", { length: 100 }).notNull(),
  personaName: varchar("personaName", { length: 255 }).notNull(),
  personaTitle: varchar("personaTitle", { length: 255 }).notNull(),
  context: text("context").notNull(),
  status: varchar("status", { length: 20 }).default("active").notNull(), // active, completed, abandoned
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  endedAt: timestamp("endedAt"),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

// Messages within a conversation
export const messages = mysqlTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: bigint("conversationId", { mode: "number", unsigned: true }).notNull(),
  role: varchar("role", { length: 10 }).notNull(), // ai, user, system
  text: text("text").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Scenario results - coaching scores after completion
export const scenarioResults = mysqlTable("scenarioResults", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  conversationId: bigint("conversationId", { mode: "number", unsigned: true }).notNull(),
  scenarioId: varchar("scenarioId", { length: 100 }).notNull(),
  roleId: varchar("roleId", { length: 100 }).notNull(),
  overallScore: tinyint("overallScore").notNull(), // 0-100
  coachingPoints: json("coachingPoints").notNull(),
  timeSpent: bigint("timeSpent", { mode: "number", unsigned: true }).notNull(), // seconds
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type ScenarioResult = typeof scenarioResults.$inferSelect;
export type InsertScenarioResult = typeof scenarioResults.$inferInsert;

// ==========================================
// OPERATIONAL CRM TABLES
// ==========================================

// Note seller leads
export const sellers = mysqlTable("sellers", {
  id: serial("id").primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  propertyAddress: varchar("propertyAddress", { length: 500 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 10 }),
  noteType: varchar("noteType", { length: 50 }), // performing, sub-performing, non-performing
  upb: varchar("upb", { length: 50 }), // unpaid principal balance
  interestRate: varchar("interestRate", { length: 20 }),
  monthlyPayment: varchar("monthlyPayment", { length: 20 }),
  remainingTerm: varchar("remainingTerm", { length: 20 }),
  ltv: varchar("ltv", { length: 10 }),
  source: varchar("source", { length: 50 }).notNull(), // direct-mail, referral, website, cold-call, event, other
  status: varchar("status", { length: 20 }).default("new-lead").notNull(), // new-lead, contacted, qualified, under-contract, closed-lost, closed-won
  priority: varchar("priority", { length: 10 }).default("medium").notNull(), // high, medium, low
  notes: text("notes"),
  nextFollowUp: timestamp("nextFollowUp"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Seller = typeof sellers.$inferSelect;
export type InsertSeller = typeof sellers.$inferInsert;

// Buyer pool members
export const buyers = mysqlTable("buyers", {
  id: serial("id").primaryKey(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  title: varchar("title", { length: 100 }),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  linkedInUrl: varchar("linkedInUrl", { length: 500 }),
  category: varchar("category", { length: 50 }).notNull(), // institutional, private, ira, family-office, syndicate
  status: varchar("status", { length: 20 }).default("prospect").notNull(), // prospect, pending, qualified, conditional, active, passive, dormant, disqualified
  tier: varchar("tier", { length: 5 }).default("C").notNull(), // A, B, C
  sourceChannel: varchar("sourceChannel", { length: 50 }).notNull(), // marketplace, linkedin, conference, referral, direct, inbound, association
  preferredStates: text("preferredStates"), // comma-separated
  minUpb: varchar("minUpb", { length: 20 }),
  maxUpb: varchar("maxUpb", { length: 20 }),
  targetYield: varchar("targetYield", { length: 20 }),
  maxLtv: varchar("maxLtv", { length: 10 }),
  notePreference: varchar("notePreference", { length: 50 }), // performing-only, sub-performing-ok, non-performing-ok
  propertyTypes: varchar("propertyTypes", { length: 100 }), // sfr, multi, commercial, land
  proofOfFunds: text("proofOfFunds"), // attachment reference or notes
  pofAmount: varchar("pofAmount", { length: 50 }),
  pofDate: timestamp("pofDate"),
  ndaStatus: varchar("ndaStatus", { length: 20 }).default("not-sent").notNull(), // not-sent, sent, signed, expired
  ndaSignedDate: timestamp("ndaSignedDate"),
  accreditedInvestor: tinyint("accreditedInvestor"), // 1=yes, 0=no, null=unknown
  notes: text("notes"),
  lastContactDate: timestamp("lastContactDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Buyer = typeof buyers.$inferSelect;
export type InsertBuyer = typeof buyers.$inferInsert;

// Deals / pipeline
export const deals = mysqlTable("deals", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  sellerId: bigint("sellerId", { mode: "number", unsigned: true }),
  buyerId: bigint("buyerId", { mode: "number", unsigned: true }),
  propertyAddress: varchar("propertyAddress", { length: 500 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 10 }),
  noteType: varchar("noteType", { length: 50 }),
  upb: varchar("upb", { length: 50 }),
  assignmentPrice: varchar("assignmentPrice", { length: 50 }),
  monthlyPayment: varchar("monthlyPayment", { length: 20 }),
  interestRate: varchar("interestRate", { length: 20 }),
  ltv: varchar("ltv", { length: 10 }),
  yield: varchar("yield", { length: 20 }),
  status: varchar("status", { length: 30 }).default("sourcing").notNull(),
  // sourcing -> underwriting -> marketing -> loi-received -> due-diligence -> closing -> closed-won / closed-lost
  stage: varchar("stage", { length: 30 }).default("sourcing").notNull(),
  earnestDeposit: varchar("earnestDeposit", { length: 20 }),
  closingDate: timestamp("closingDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull().$onUpdate(() => new Date()),
});

export type Deal = typeof deals.$inferSelect;
export type InsertDeal = typeof deals.$inferInsert;

// Activities / interaction log
export const activities = mysqlTable("activities", {
  id: serial("id").primaryKey(),
  entityType: varchar("entityType", { length: 20 }).notNull(), // seller, buyer, deal
  entityId: bigint("entityId", { mode: "number", unsigned: true }).notNull(),
  activityType: varchar("activityType", { length: 30 }).notNull(), // call, email, meeting, note, status-change, follow-up
  subject: varchar("subject", { length: 255 }),
  description: text("description"),
  outcome: varchar("outcome", { length: 50 }), // interested, not-interested, callback, no-answer, voicemail, scheduled
  followUpDate: timestamp("followUpDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;
