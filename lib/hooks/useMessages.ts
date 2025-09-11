import { trpc } from '@/lib/api/client';

export const useMessages = (conversationId: string) => {
  return trpc.message.getMessages.useQuery(
    { conversationId },
    {
      enabled: !!conversationId,
      refetchOnWindowFocus: false,
    }
  );
};

export const useCreateMessage = () => {
  const utils = trpc.useUtils();
  
  return trpc.message.createMessage.useMutation({
    onSuccess: (data, variables) => {
      console.log("Data: ", data);
      
      // Invalidate and refetch messages for this conversation
      utils.message.getMessages.invalidate({ 
        conversationId: variables.conversationId 
      });
      
      // Also invalidate conversations to update last message
      utils.conversation.getUserConversations.invalidate();
    },
    onError: (error) => {
      console.error('Failed to create message:', error);
    },
  });
};