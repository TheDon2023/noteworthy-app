import { z } from "zod";
import { createRouter, publicQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { users, employeeProfiles, skillRatings, trainingAssignments, scenarioResults } from "@db/schema";
import { eq, desc } from "drizzle-orm";

async function withFallback<T>(dbFn: () => Promise<T>, fallbackFn: () => T): Promise<T> {
  try {
    return await dbFn();
  } catch {
    return fallbackFn();
  }
}

export const employeeRouter = createRouter({
  // ========== EMPLOYEE DIRECTORY ==========
  listEmployees: publicQuery.query(async () => {
    return withFallback(
      async () => {
        const allUsers = await getDb().query.users.findMany({
          orderBy: [desc(users.createdAt)],
        });
        const profiles = await getDb().query.employeeProfiles.findMany();
        const profileMap = new Map(profiles.map(p => [p.userId, p]));
        return allUsers.map(u => ({
          ...u,
          profile: profileMap.get(u.id) || null,
        }));
      },
      () => [],
    );
  }),

  getEmployee: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return withFallback(
        async () => {
          const user = await getDb().query.users.findFirst({
            where: eq(users.id, input.userId),
          });
          if (!user) return null;
          const profile = await getDb().query.employeeProfiles.findFirst({
            where: eq(employeeProfiles.userId, input.userId),
          });
          const skills = await getDb().query.skillRatings.findMany({
            where: eq(skillRatings.userId, input.userId),
            orderBy: [desc(skillRatings.assessmentDate)],
          });
          const trainings = await getDb().query.trainingAssignments.findMany({
            where: eq(trainingAssignments.userId, input.userId),
            orderBy: [desc(trainingAssignments.assignedAt)],
          });
          const results = await getDb().query.scenarioResults.findMany({
            where: eq(scenarioResults.userId, input.userId),
            orderBy: [desc(scenarioResults.completedAt)],
          });
          return { user, profile, skills, trainings, results };
        },
        () => null,
      );
    }),

  // ========== EMPLOYEE PROFILE MANAGEMENT ==========
  upsertProfile: publicQuery
    .input(z.object({
      userId: z.number(),
      jobRole: z.string().optional(),
      department: z.string().optional(),
      status: z.string().default("active"),
      phone: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { userId, ...data } = input;
      return withFallback(
        async () => {
          const existing = await getDb().query.employeeProfiles.findFirst({
            where: eq(employeeProfiles.userId, userId),
          });
          if (existing) {
            await getDb().update(employeeProfiles).set(data).where(eq(employeeProfiles.id, existing.id));
            return getDb().query.employeeProfiles.findFirst({
              where: eq(employeeProfiles.id, existing.id),
            });
          }
          const [inserted] = await getDb().insert(employeeProfiles).values({
            userId,
            ...data,
          }).$returningId();
          return getDb().query.employeeProfiles.findFirst({
            where: eq(employeeProfiles.id, inserted.id),
          });
        },
        () => null,
      );
    }),

  ensureProfile: publicQuery
    .input(z.object({
      userId: z.number(),
      name: z.string().optional(),
      email: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return withFallback(
        async () => {
          const existing = await getDb().query.employeeProfiles.findFirst({
            where: eq(employeeProfiles.userId, input.userId),
          });
          if (existing) return existing;
          const [inserted] = await getDb().insert(employeeProfiles).values({
            userId: input.userId,
            status: "active",
            notes: `Auto-created on login. Email: ${input.email || 'N/A'}`,
          }).$returningId();
          return getDb().query.employeeProfiles.findFirst({
            where: eq(employeeProfiles.id, inserted.id),
          });
        },
        () => null,
      );
    }),

  // ========== SKILL RATINGS ==========
  addSkillRating: publicQuery
    .input(z.object({
      userId: z.number(),
      skillArea: z.string().min(1),
      rating: z.number().min(1).max(10),
      assessedBy: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return withFallback(
        async () => {
          const [inserted] = await getDb().insert(skillRatings).values({
            userId: input.userId,
            skillArea: input.skillArea,
            rating: input.rating,
            assessedBy: input.assessedBy || "manager",
            notes: input.notes || null,
          }).$returningId();
          return getDb().query.skillRatings.findFirst({
            where: eq(skillRatings.id, inserted.id),
          });
        },
        () => null,
      );
    }),

  getSkillRatings: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return withFallback(
        async () => getDb().query.skillRatings.findMany({
          where: eq(skillRatings.userId, input.userId),
          orderBy: [desc(skillRatings.assessmentDate)],
        }),
        () => [],
      );
    }),

  // ========== TRAINING ASSIGNMENTS ==========
  createTraining: publicQuery
    .input(z.object({
      userId: z.number(),
      title: z.string().min(1),
      description: z.string().optional(),
      trainingType: z.string().min(1), // scenario | study-material | sop-review | mentor-session
      relatedRole: z.string().optional(),
      relatedSkill: z.string().optional(),
      priority: z.string().default("medium"),
      dueDate: z.date().optional(),
    }))
    .mutation(async ({ input }) => {
      return withFallback(
        async () => {
          const [inserted] = await getDb().insert(trainingAssignments).values({
            userId: input.userId,
            title: input.title,
            description: input.description || null,
            trainingType: input.trainingType,
            relatedRole: input.relatedRole || null,
            relatedSkill: input.relatedSkill || null,
            priority: input.priority,
            dueDate: input.dueDate || null,
          }).$returningId();
          return getDb().query.trainingAssignments.findFirst({
            where: eq(trainingAssignments.id, inserted.id),
          });
        },
        () => null,
      );
    }),

  listTrainings: publicQuery
    .input(z.object({ userId: z.number() }).optional())
    .query(async ({ input }) => {
      return withFallback(
        async () => {
          if (input?.userId) {
            return getDb().query.trainingAssignments.findMany({
              where: eq(trainingAssignments.userId, input.userId),
              orderBy: [desc(trainingAssignments.assignedAt)],
            });
          }
          return getDb().query.trainingAssignments.findMany({
            orderBy: [desc(trainingAssignments.assignedAt)],
          });
        },
        () => [],
      );
    }),

  updateTrainingStatus: publicQuery
    .input(z.object({
      id: z.number(),
      status: z.string(), // assigned | in-progress | completed | overdue
      completionNotes: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      return withFallback(
        async () => {
          const updateData: any = { status: input.status };
          if (input.status === "completed") {
            updateData.completedAt = new Date();
          }
          if (input.completionNotes) {
            updateData.completionNotes = input.completionNotes;
          }
          await getDb().update(trainingAssignments).set(updateData).where(eq(trainingAssignments.id, input.id));
          return getDb().query.trainingAssignments.findFirst({
            where: eq(trainingAssignments.id, input.id),
          });
        },
        () => null,
      );
    }),

  // ========== PERFORMANCE ANALYTICS ==========
  getPerformanceSummary: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return withFallback(
        async () => {
          const results = await getDb().query.scenarioResults.findMany({
            where: eq(scenarioResults.userId, input.userId),
            orderBy: [desc(scenarioResults.completedAt)],
          });
          const skills = await getDb().query.skillRatings.findMany({
            where: eq(skillRatings.userId, input.userId),
          });
          const trainings = await getDb().query.trainingAssignments.findMany({
            where: eq(trainingAssignments.userId, input.userId),
          });

          // Calculate averages per role
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

          // Skill gap analysis
          const skillMap: Record<string, number[]> = {};
          skills.forEach(s => {
            if (!skillMap[s.skillArea]) skillMap[s.skillArea] = [];
            skillMap[s.skillArea].push(s.rating);
          });
          const skillAverages = Object.entries(skillMap).map(([skillArea, ratings]) => ({
            skillArea,
            avgRating: Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length),
          }));

          // Identify skill gaps (ratings below 6)
          const skillGaps = skillAverages.filter(s => s.avgRating < 6).map(s => s.skillArea);

          // Training completion rate
          const completedTrainings = trainings.filter(t => t.status === "completed").length;
          const totalTrainings = trainings.length;
          const trainingCompletionRate = totalTrainings > 0
            ? Math.round((completedTrainings / totalTrainings) * 100)
            : 0;

          return {
            totalScenarios: results.length,
            overallAverage: results.length > 0
              ? Math.round(results.reduce((sum, r) => sum + r.overallScore, 0) / results.length)
              : 0,
            bestRole: roleAverages.length > 0
              ? roleAverages.sort((a, b) => b.avgScore - a.avgScore)[0]
              : null,
            weakestRole: roleAverages.length > 0
              ? roleAverages.sort((a, b) => a.avgScore - b.avgScore)[0]
              : null,
            roleAverages,
            skillAverages,
            skillGaps,
            trainingCompletionRate,
            pendingTrainings: trainings.filter(t => t.status === "assigned" || t.status === "in-progress").length,
          };
        },
        () => null,
      );
    }),

  // ========== TEAM DASHBOARD ==========
  getTeamDashboard: publicQuery.query(async () => {
    return withFallback(
      async () => {
        const allUsers = await getDb().query.users.findMany();
        const profiles = await getDb().query.employeeProfiles.findMany();
        const allResults = await getDb().query.scenarioResults.findMany({
          orderBy: [desc(scenarioResults.completedAt)],
        });
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
            avatar: u.avatar,
            jobRole: profile?.jobRole || "Unassigned",
            status: profile?.status || "active",
            totalScenarios: userResults.length,
            avgScore,
            skillAvg,
            completionRate,
            pendingTrainings: userTrainings.filter(t => t.status === "assigned" || t.status === "in-progress").length,
          };
        });
      },
      () => [],
    );
  }),

  // ========== RECOMMEND TRAINING (for Mr. GetMoney) ==========
  recommendTraining: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return withFallback(
        async () => {
          const performance = await getDb().query.scenarioResults.findMany({
            where: eq(scenarioResults.userId, input.userId),
            orderBy: [desc(scenarioResults.completedAt)],
          });
          const skills = await getDb().query.skillRatings.findMany({
            where: eq(skillRatings.userId, input.userId),
          });

          const recommendations: Array<{
            type: string;
            title: string;
            reason: string;
            priority: string;
          }> = [];

          // Analyze scenario performance
          const roleScores: Record<string, number[]> = {};
          performance.forEach(p => {
            if (!roleScores[p.roleId]) roleScores[p.roleId] = [];
            roleScores[p.roleId].push(p.overallScore);
          });

          // Find weak roles
          Object.entries(roleScores).forEach(([roleId, scores]) => {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            if (avg < 70) {
              recommendations.push({
                type: "scenario",
                title: `Practice ${roleId.replace(/-/g, " ")} scenarios`,
                reason: `Average score ${Math.round(avg)}% — needs improvement to reach 80%`,
                priority: avg < 50 ? "high" : "medium",
              });
            }
          });

          // Find skill gaps
          const skillMap: Record<string, number[]> = {};
          skills.forEach(s => {
            if (!skillMap[s.skillArea]) skillMap[s.skillArea] = [];
            skillMap[s.skillArea].push(s.rating);
          });

          Object.entries(skillMap).forEach(([skillArea, ratings]) => {
            const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
            if (avg < 6) {
              recommendations.push({
                type: "study-material",
                title: `Review ${skillArea.replace(/-/g, " ")} materials`,
                reason: `Skill rating ${Math.round(avg)}/10 — below threshold of 6`,
                priority: avg < 4 ? "high" : "medium",
              });
            }
          });

          // If no performance data, recommend starting with basics
          if (performance.length === 0) {
            recommendations.push({
              type: "scenario",
              title: "Complete your first practice call",
              reason: "No training activity recorded — start with Acquisition Lead scenarios",
              priority: "high",
            });
          }

          return {
            userId: input.userId,
            recommendations,
            totalScenarios: performance.length,
            overallAverage: performance.length > 0
              ? Math.round(performance.reduce((sum, p) => sum + p.overallScore, 0) / performance.length)
              : 0,
          };
        },
        () => null,
      );
    }),

  // ========== DAILY BRIEFING (War Room) ==========
  dailyBriefing: publicQuery
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return withFallback(
        async () => {
          const now = new Date();
          const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

          const user = await getDb().query.users.findFirst({
            where: eq(users.id, input.userId),
          });
          if (!user) return null;

          const profile = await getDb().query.employeeProfiles.findFirst({
            where: eq(employeeProfiles.userId, input.userId),
          });

          // Yesterday's work
          const results = await getDb().query.scenarioResults.findMany({
            where: eq(scenarioResults.userId, input.userId),
            orderBy: [desc(scenarioResults.completedAt)],
          });
          const yesterdaysResults = results.filter(r => {
            const d = r.completedAt ? new Date(r.completedAt) : null;
            return d && d >= yesterday && d < now;
          });

          // Training activity
          const allTrainings = await getDb().query.trainingAssignments.findMany({
            where: eq(trainingAssignments.userId, input.userId),
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
            where: eq(skillRatings.userId, input.userId),
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

          // Company health
          const allSellers = await getDb().query.sellers.findMany();
          const allBuyers = await getDb().query.buyers.findMany();
          const allDeals = await getDb().query.deals.findMany();

          const buyerPoolLow = allBuyers.filter(b => b.status === "qualified" || b.status === "active").length < 10;
          const sellerLeadsLow = allSellers.filter(s => s.status === "new-lead" || s.status === "contacted").length < 5;
          const dealsStalled = allDeals.filter(d => d.stage === "sourcing" || d.stage === "marketing").length > 0 &&
            allDeals.filter(d => d.stage === "closing" || d.stage === "closed-won").length === 0;

          // Working hours check (ET)
          const etNow = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
          const etHour = etNow.getHours();
          const etDay = etNow.getDay();
          const inWorkingHours = etDay >= 1 && etDay <= 5 && etHour >= 9 && etHour < 17;

          // Role performance
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

          // Determine primary action
          let primaryAction = "earn";
          let actionTitle = "Time to Earn";
          let actionDescription = "Everything looks good. What can you close today?";

          if (skillGaps.length > 0) {
            primaryAction = "train";
            actionTitle = "Training Required";
            actionDescription = `Skill gaps detected: ${skillGaps.map(g => g.skillArea.replace(/-/g, " ")).join(", ")}. Complete training before real work.`;
          } else if (buyerPoolLow) {
            primaryAction = "source-buyers";
            actionTitle = "Buyer Pool Critical";
            actionDescription = `Only ${allBuyers.filter(b => b.status === "qualified" || b.status === "active").length} qualified buyers. Goal: 10. Source investors now.`;
          } else if (sellerLeadsLow) {
            primaryAction = "source-sellers";
            actionTitle = "Need Seller Leads";
            actionDescription = `Only ${allSellers.filter(s => s.status === "new-lead" || s.status === "contacted").length} active seller leads. Time to prospect.`;
          } else if (dealsStalled) {
            primaryAction = "push-deals";
            actionTitle = "Deals Need Pushing";
            actionDescription = `${allDeals.filter(d => d.stage === "sourcing" || d.stage === "marketing").length} deals stuck in early stages. Move them forward.`;
          }

          return {
            inWorkingHours,
            employee: {
              id: user.id,
              name: user.name,
              jobRole: profile?.jobRole || "Unassigned",
            },
            yesterday: {
              scenariosCompleted: yesterdaysResults.length,
              avgScore: yesterdaysResults.length > 0
                ? Math.round(yesterdaysResults.reduce((s, r) => s + r.overallScore, 0) / yesterdaysResults.length)
                : 0,
              trainingsCompleted: trainingsCompletedYesterday.length,
              wasIdle: yesterdaysResults.length === 0 && trainingsCompletedYesterday.length === 0,
            },
            today: {
              pendingTrainings: trainingsPending.length,
              overdueTrainings: trainingsOverdue.length,
              skillGaps,
              roleAverages,
            },
            companyHealth: {
              totalSellers: allSellers.length,
              totalBuyers: allBuyers.length,
              totalDeals: allDeals.length,
              buyerPoolLow,
              sellerLeadsLow,
              dealsStalled,
            },
            priority: {
              primaryAction,
              actionTitle,
              actionDescription,
              shouldTrain: skillGaps.length > 0,
              shouldSourceBuyers: buyerPoolLow && skillGaps.length === 0,
              shouldSourceSellers: sellerLeadsLow && !buyerPoolLow && skillGaps.length === 0,
              shouldPushDeals: dealsStalled && !buyerPoolLow && !sellerLeadsLow && skillGaps.length === 0,
            },
          };
        },
        () => null,
      );
    }),
});
