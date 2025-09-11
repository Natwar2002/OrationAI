// server/context.ts
import { initTRPC } from '@trpc/server';
import { getPrisma } from '@/lib/db';

export const trpc = initTRPC.create();

// Safe context creation that handles Prisma not being available
export const createContext = async () => {
  try {
    const prisma = getPrisma();
    return { prisma };
  } catch (error) {
    console.error('Prisma not available in context:', error);
    // Return context without prisma - your procedures will need to handle this
    return {};
  }
};

export type Context = Awaited<ReturnType<typeof createContext>>;