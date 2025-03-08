import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { jwtVerify } from 'jose';

// Force Node.js runtime
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    // Get token from query string
    const token = request.nextUrl.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'Missing token' },
        { status: 400 }
      );
    }
    
    // Verify JWT signature
    try {
      await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET || 'replace-with-secure-secret-in-env-file')
      );
    } catch (error) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired token' },
        { status: 400 }
      );
    }
    
    // Connect to database to check if token exists
    const { db } = await connectToDatabase();
    
    // Find token in database
    const resetRequest = await db.collection('passwordResets').findOne({ token });
    
    if (!resetRequest) {
      return NextResponse.json(
        { valid: false, error: 'Token not found' },
        { status: 400 }
      );
    }
    
    // Check if token is expired
    if (new Date() > new Date(resetRequest.expiresAt)) {
      return NextResponse.json(
        { valid: false, error: 'Token has expired' },
        { status: 400 }
      );
    }
    
    // Token is valid
    return NextResponse.json({ valid: true });
  } catch (error: any) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { valid: false, error: 'Failed to verify token' },
      { status: 500 }
    );
  }
}