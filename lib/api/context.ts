import { QueryClient } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './client';

// Create TRPC client instance
export const createTRPCClient = () => {
  return trpc.createClient({
    links: [
      httpBatchLink({
        url: '/api/trpc',
        // Optional: Add headers, authentication, etc.
        // headers() {
        //   return {
        //     authorization: getAuthToken(),
        //   };
        // },
      }),
    ],
  });
};

// Create React Query client
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 1,
      },
    },
  });
};