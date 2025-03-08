import { NextResponse } from 'next/server';
import clientPromise from '@/lib/db/mongodb';

// Force Node.js runtime
export const runtime = 'nodejs';

export async function GET() {
  try {
    const client = await clientPromise;
    await client.db().command({ ping: 1 });
    
    return NextResponse.json({ 
      status: 'success',
      message: 'MongoDB connection verified'
    });
  } catch (error: any) {
    console.error('MongoDB connection error in API route:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to MongoDB',
      error: error.message
    }, { status: 500 });
  }
}