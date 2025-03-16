import { initTRPC } from '@trpc/server';
export { createHTTPServer } from '@trpc/server/adapters/standalone';

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
