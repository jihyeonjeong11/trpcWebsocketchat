import { router, publicProcedure, authedProcedure } from '../trpc';
import * as z from 'zod';

export const userRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: authedProcedure.query(() => {
    return 'you can now see this secret message!';
  }),
  changeUserData: authedProcedure
    .input(
      z.object({
        name: z.string().nullish(),
        username: z.string().nullish(),
        image: z.string().nullish(),
      }),
    )
    .mutation(({ input: { username, name, image }, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: ctx.session?.user?.id,
        },
        data: {
          name,
          username,
          image,
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      });
    }),
  changeUserTheme: authedProcedure
    .input(z.object({ theme: z.enum(['light', 'dark']) }))
    .mutation(({ input: { theme }, ctx }) => {
      return ctx.prisma.user.update({
        data: {
          theme,
        },
        where: {
          id: ctx.session?.user?.id,
        },
        select: {
          id: true,
          theme: true,
        },
      });
    }),
  users: authedProcedure
    .input(z.object({ user: z.string() }))
    .query(({ input: { user }, ctx }) => {
      return ctx.prisma.user.findMany({
        where: {
          OR: [
            {
              name: {
                contains: user,
                mode: 'insensitive',
              },
              username: {
                contains: user,
                mode: 'insensitive',
              },
            },
          ],
          NOT: { id: ctx.session?.user?.id }, // don't want to return myself.
        },
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      });
    }),
});

// usermodel is all nullish because it can be freely changed
// also, prisma does not update undefined values, so empty value must be null.
