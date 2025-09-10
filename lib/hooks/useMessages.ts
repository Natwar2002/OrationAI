import { trpc } from '@/lib/api/client';

// Hook to get messages for a conversation
export const useMessages = (conversationId: string) => {
  const {
    data: messages,
    isLoading,
    error,
    refetch,
  } = trpc.message.getMessages.useQuery(
    { conversationId },
    {
      enabled: !!conversationId, // Only run query if conversationId exists
    }
  );

  return {
    messages,
    isLoading,
    error,
    refetch,
  };
};

// Hook to create a new message
export const useCreateMessage = () => {
  const utils = trpc.useContext();
  const mutation = trpc.message.createMessage.useMutation({
    onSuccess: (data, variables) => {
      // Invalidate messages query for the specific conversation
      utils.message.getMessages.invalidate({ conversationId: variables.conversationId });
    },
  });

  return mutation;
};