import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const messageRouter = router({
  getMessages: publicProcedure
    .input(z.object({
      conversationId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const messages = await ctx.prisma.message.findMany({
          where: {
            conversationId: input.conversationId,
          },
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            conversation: true, // Include conversation data if needed
          },
        });
        
        return messages;
      } catch (error) {
        console.error('Error fetching messages:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch messages',
        });
      }
    }),

  createMessage: publicProcedure
    .input(z.object({
      conversationId: z.string(),
      content: z.string().min(1, 'Message content is required'),
      senderId: z.string(),
      type: z.enum(['text', 'image', 'file']).optional().default('text'),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // First verify the conversation exists
        const conversation = await ctx.prisma.conversation.findUnique({
          where: { id: input.conversationId },
        });

        if (!conversation) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Conversation not found',
          });
        }

        const message = await ctx.prisma.message.create({
          data: {
            content: input.content,
            senderId: input.senderId,
            conversationId: input.conversationId,
            type: input.type,
          },
          include: {
            conversation: true,
          },
        });

        return message;
      } catch (error) {
        console.error('Error creating message:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create message',
        });
      }
    }),
});