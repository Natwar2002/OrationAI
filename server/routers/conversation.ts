import { z } from 'zod';
import { trpc } from '../context';
import { ConversationService } from '../services/conversationService';

const conversationService = new ConversationService();

export const conversationRouter = trpc.router({
  // Create a new conversation
  createConversation: trpc.procedure
    .input(z.object({
      name: z.string().min(1, 'Conversation name cannot be empty'),
      userId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const { name, userId } = input;
      return conversationService.createConversation(name, userId);
    }),

  // Get a conversation by ID
  getConversation: trpc.procedure
    .input(z.object({
      id: z.string().uuid(),
    }))
    .query(async ({ input }) => {
      const { id } = input;
      return conversationService.getConversation(id);
    }),

  // Get all conversations for a user
  getUserConversations: trpc.procedure
    .input(z.object({
      userId: z.string().uuid(),
    }))
    .query(async ({ input }) => {
      const { userId } = input;
      return conversationService.getUserConversations(userId);
    }),

});