import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers/app';

// Create the tRPC React client
export const trpc = createTRPCReact<AppRouter>();