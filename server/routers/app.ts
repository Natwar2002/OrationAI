import { router } from '../trpc';
import { messageRouter } from './message';
import { conversationRouter } from './conversation';

export const appRouter = router({
  message: messageRouter,
  conversation: conversationRouter,
});

export type AppRouter = typeof appRouter;