/**
 * This file contains the root router of your tRPC-backend
 */
import { router } from '../trpc';
import { chatRouter } from './chat';
// import { postRouter } from './post';
// import { observable } from '@trpc/server/observable';
// import { clearInterval } from 'timers';
import { userRouter } from './user';

export const appRouter = router({
  chat: chatRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
