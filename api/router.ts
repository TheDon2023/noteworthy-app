import { authRouter } from "./auth-router";
import { aiRouter } from "./ai-router";
import { mentorRouter } from "./mentor-router";
import { operationsRouter } from "./operations-router";
import { employeeRouter } from "./employee-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  ai: aiRouter,
  mentor: mentorRouter,
  ops: operationsRouter,
  employee: employeeRouter,
});

export type AppRouter = typeof appRouter;
