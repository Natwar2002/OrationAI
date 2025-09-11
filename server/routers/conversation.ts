import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const conversationRouter = router({
  getUserConversations: publicProcedure
    .input(z.object({
      userId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const conversations = await ctx.prisma.conversation.findMany({
          where: {
            participants: {
              some: {
                userId: input.userId,
              },
            },
          },
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            messages: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1, // Get the latest message
            },
            _count: {
              select: {
                messages: true,
              },
            },
          },
          orderBy: {
            updatedAt: 'desc',
          },
        });

        return conversations;
      } catch (error) {
        console.error('Error fetching conversations:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch conversations',
        });
      }
    }),

  createConversation: publicProcedure
    .input(z.object({
      title: z.string().optional(),
      participantIds: z.array(z.string()).min(1, 'At least one participant is required'),
      type: z.enum(['private', 'group']).optional().default('private'),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const conversation = await ctx.prisma.conversation.create({
          data: {
            title: input.title,
            type: input.type,
            participants: {
              create: input.participantIds.map((userId) => ({
                userId,
                role: 'member',
              })),
            },
          },
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        });

        return conversation;
      } catch (error) {
        console.error('Error creating conversation:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create conversation',
        });
      }
    }),

  getConversationById: publicProcedure
    .input(z.object({
      conversationId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      try {
        const conversation = await ctx.prisma.conversation.findUnique({
          where: { id: input.conversationId },
          include: {
            participants: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
            messages: {
              orderBy: {
                createdAt: 'asc',
              },
              take: 50, // Limit initial messages
            },
          },
        });

        if (!conversation) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Conversation not found',
          });
        }

        return conversation;
      } catch (error) {
        console.error('Error fetching conversation:', error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch conversation',
        });
      }
    }),
});