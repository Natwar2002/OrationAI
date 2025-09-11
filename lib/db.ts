// lib/db.ts
import { PrismaClient } from '@prisma/client';

// Global variable to avoid multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Safe function to get Prisma client
export const getPrisma = (): PrismaClient | null => {
  // Return existing instance if available
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  try {
    // Try to create new instance
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
    return globalForPrisma.prisma;
  } catch (error) {
    console.error('❌ Prisma client initialization failed:', error);
    return null;
  }
};

// Function to check if Prisma is available
export const isPrismaAvailable = (): boolean => {
  try {
    const prisma = getPrisma();
    return prisma !== null;
  } catch {
    return false;
  }
};

// Function to test database connection
export const testDatabaseConnection = async (): Promise<{
  connected: boolean;
  error?: string;
}> => {
  try {
    const prisma = getPrisma();
    if (!prisma) {
      return { connected: false, error: 'Prisma client not initialized' };
    }

    // Test connection with a simple query
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true };
  } catch (error: any) {
    return { connected: false, error: error.message };
  }
};