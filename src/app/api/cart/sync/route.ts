import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getUserFromToken } from '@/lib/auth/serverAuthUtils';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Get cart data from database
    const cart = await db.collection('carts').findOne({ userId: user._id });
    
    return NextResponse.json({
      items: cart?.items || []
    });
  } catch (error: any) {
    console.error('Failed to get cart:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}