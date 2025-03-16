import { initTRPC } from '@trpc/server';
import { OpenApiMeta } from "trpc-to-openapi";
export { createHTTPServer } from '@trpc/server/adapters/standalone';

const t = initTRPC.meta<OpenApiMeta>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
