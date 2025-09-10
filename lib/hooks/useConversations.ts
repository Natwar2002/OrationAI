import { trpc } from '@/lib/api/client';

// Hook to get all conversations for a user
export const useConversations = (userId: string) => {
  const {
    data: conversations,
    isLoading,
    error,
    refetch,
  } = trpc.conversation.getUserConversations.useQuery(
    { userId },
    {
      enabled: !!userId, // Only run query if userId exists
    }
  );

  return {
    conversations,
    isLoading,
    error,
    refetch,
  };
};

// Hook to create a new conversation
export const useCreateConversation = () => {
  const utils = trpc.useContext();
  const mutation = trpc.conversation.createConversation.useMutation({
    onSuccess: () => {
      // Invalidate conversations query to refetch data
      utils.conversation.getUserConversations.invalidate();
    },
  });

  return mutation;
};