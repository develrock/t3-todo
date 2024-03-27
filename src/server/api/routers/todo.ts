import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  getMyTodos: protectedProcedure
    .query(({ ctx }) =>
      ctx.db.todo.findMany({
        where: {
          createdBy: { id: ctx.session.user.id },
        },
        orderBy: { createdAt: "desc" }
      })
    ),

  create: protectedProcedure
    .input(z.object({ text: z.string().min(1, { message: "No empty strings" }) }))
    .mutation(({ ctx, input }) =>
      ctx.db.todo.create({
        data: {
          createdBy: { connect: { id: ctx.session.user.id } },
          text: input.text
        }
      })
    ),

  setDone: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        done: z.boolean()
      })).mutation(({ ctx, input }) =>
        ctx.db.todo.update({
          where: { id: input.id, createdBy: { id: ctx.session.user.id } },
          data: { done: input.done }
        })),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) =>
      ctx.db.todo.delete({
        where: { id: input.id, createdBy: { id: ctx.session.user.id } }
      })
    )
});
