import { trpc } from '@/lib/api/client';

export const useConversations = (userId: string) => {
  return trpc.conversation.getUserConversations.useQuery(
    { userId },
    {
      enabled: !!userId,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCreateConversation = () => {
  const utils = trpc.useUtils();
  
  return trpc.conversation.createConversation.useMutation({
    onSuccess: () => {
      utils.conversation.getUserConversations.invalidate();
    },
  });
};

export const useConversation = (conversationId: string) => {
  return trpc.conversation.getConversationById.useQuery(
    { conversationId },
    {
      enabled: !!conversationId,
      refetchOnWindowFocus: false,
    }
  );
};