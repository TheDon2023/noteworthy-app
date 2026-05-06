import { authRouter } from "./auth-router";
import { aiRouter } from "./ai-router";
import { mentorRouter } from "./mentor-router";
import { operationsRouter } from "./operations-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  ai: aiRouter,
  mentor: mentorRouter,
  ops: operationsRouter,
});

export type AppRouter = typeof appRouter;
