import { z } from 'zod';
import { trpc } from '../context';
import { MessageService } from '../services/messageService';
import { Role } from '@/lib/generated/prisma';

const messageService = new MessageService();

export const messageRouter = trpc.router({
  // Create a new message
  createMessage: trpc.procedure
    .input(z.object({
      text: z.string().min(1, 'Message text cannot be empty'),
      sender: z.nativeEnum(Role),
      conversationId: z.string().uuid(),
    }))
    .mutation(async ({ input }) => {
      const { text, sender, conversationId } = input;
      return messageService.createMessage(text, sender, conversationId);
    }),

  // Get messages for a conversation
  getMessages: trpc.procedure
    .input(z.object({
      conversationId: z.string().uuid(),
    }))
    .query(async ({ input }) => {
      const { conversationId } = input;
      return messageService.getMessages(conversationId);
    }),
});