import { prisma } from '../context';

export class ConversationRepository {
  // Create a new conversation
  async create(name: string, userId: string) {
    return prisma.conversation.create({
      data: {
        name,
        userId,
      },
    });
  }

  // Get conversation by ID
  async getById(id: string) {
    return prisma.conversation.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  // Get all conversations for a user
  async getByUserId(userId: string) {
    return prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}