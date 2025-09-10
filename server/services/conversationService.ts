import { ConversationRepository } from '../repositories/conversationRepository';

export class ConversationService {
  private conversationRepository: ConversationRepository;

  constructor() {
    this.conversationRepository = new ConversationRepository();
  }

  // Create a new conversation
  async createConversation(name: string, userId: string) {
    if (!name.trim()) {
      throw new Error('Conversation name cannot be empty');
    }

    if (!userId) {
      throw new Error('User ID is required');
    }

    return this.conversationRepository.create(name.trim(), userId);
  }

  // Get conversation by ID
  async getConversation(id: string) {
    if (!id) {
      throw new Error('Conversation ID is required');
    }

    return this.conversationRepository.getById(id);
  }

  // Get all conversations for a user
  async getUserConversations(userId: string) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return this.conversationRepository.getByUserId(userId);
  }
}