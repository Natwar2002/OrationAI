import { Role } from '@/lib/generated/prisma';
import { MessageRepository } from '../repositories/messageRepository';

export class MessageService {
  private messageRepository: MessageRepository;

  constructor() {
    this.messageRepository = new MessageRepository();
  }

  // Create a new message with validation
  async createMessage(text: string, sender: Role, conversationId: string) {
    if (!text.trim()) {
      throw new Error('Message text cannot be empty');
    }

    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }

    return this.messageRepository.create(text.trim(), sender, conversationId);
  }

  // Get messages for a conversation
  async getMessages(conversationId: string) {
    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }

    return this.messageRepository.getByConversationId(conversationId);
  }
}