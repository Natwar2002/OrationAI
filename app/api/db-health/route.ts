import { NextResponse } from 'next/server';
import { testDatabaseConnection, isPrismaAvailable } from '@/lib/db';

export async function GET() {
  try {
    // Check if Prisma is available first
    if (!isPrismaAvailable()) {
      return NextResponse.json(
        { 
          status: 'prisma_not_initialized', 
          message: 'Prisma client is not available',
          solution: 'Run "npx prisma generate" and restart the server',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }

    // Test the database connection
    const connection = await testDatabaseConnection();
    
    if (connection.connected) {
      return NextResponse.json({ 
        status: 'connected', 
        database: 'ready',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        { 
          status: 'disconnected', 
          error: connection.error,
          solution: 'Check your DATABASE_URL and ensure database is running',
          timestamp: new Date().toISOString()
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error("Database health check error:", error);
    
    return NextResponse.json(
      { 
        status: 'error', 
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}