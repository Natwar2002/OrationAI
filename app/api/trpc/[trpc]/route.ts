// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/app';
import { createContext } from '@/server/context';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const handler = async (request: Request) => {
  try {
    return await fetchRequestHandler({
      endpoint: '/api/trpc',
      req: request,
      router: appRouter,
      createContext,
      onError: ({ error, path }) => {
        console.error(`tRPC Error on ${path}:`, error);
        
        // Handle Prisma not initialized error specifically
        if (error.message.includes('prisma') && error.message.includes('initialize')) {
          console.error('\n⚠️  Prisma client not initialized!');
          console.error('Please run: npx prisma generate');
          console.error('Then restart the development server\n');
        }
      },
    });
  } catch (error: any) {
    console.error('tRPC handler error:', error);
    
    // Special handling for Prisma initialization errors
    if (error.message.includes('prisma') && error.message.includes('initialize')) {
      return NextResponse.json(
        { 
          error: 'Database not initialized',
          message: 'Please run "npx prisma generate" and restart the server',
          code: 'PRISMA_NOT_INITIALIZED'
        },
        { status: 503 } // Service Unavailable
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
};

export { handler as GET, handler as POST };