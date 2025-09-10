'use client';

import { useState } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/api/client';
import { createTRPCClient, createQueryClient } from '@/lib/api/context';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState<QueryClient>(createQueryClient);
  const [trpcClient] = useState(() => createTRPCClient());

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      {children}
    </trpc.Provider>
  );
}