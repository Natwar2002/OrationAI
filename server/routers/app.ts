import { trpc } from '../context';
import { messageRouter } from './message';
import { conversationRouter } from './conversation';

// Combine all routers (like combining routes in Express)
export const appRouter = trpc.router({
  message: messageRouter,
  conversation: conversationRouter,
});

// Export type for use in frontend
export type AppRouter = typeof appRouter;