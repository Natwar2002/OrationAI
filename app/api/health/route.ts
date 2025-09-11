import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'career-counseling-api',
    database: 'check /api/db-health for database status'
  });
}