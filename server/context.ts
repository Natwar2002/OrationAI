import { initTRPC } from '@trpc/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create tRPC instance - this is like initializing Express
export const trpc = initTRPC.create();

// Export prisma for use in repositories
export { prisma };