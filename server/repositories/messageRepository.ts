import { prisma } from '@/lib/db';
import { Role } from '@/lib/generated/prisma';

export class MessageRepository {
  // Create a new message
  async create(text: string, sender: Role, conversationId: string) {
    return prisma.message.create({
      data: { 
        text,
        sender,
        conversationId,
      }
    });
  }

  // Get messages by conversation ID
  async getByConversationId(conversationId: string) {
    return prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
  }
}