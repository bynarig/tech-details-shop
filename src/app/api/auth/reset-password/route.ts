import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { jwtVerify } from 'jose';
import { hashPassword } from '@/lib/auth/serverAuthUtils';
import { ObjectId } from 'mongodb';

// Force Node.js runtime
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;
    
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }
    
    // Verify JWT signature and extract user ID
    let userId;
    try {
      const { payload } = await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET || 'replace-with-secure-secret-in-env-file')
      );
      
      if (payload.purpose !== 'password-reset' || !payload.userId) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 400 }
        );
      }
      
      userId = payload.userId as string;
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }
    
    // Connect to database
    const { db } = await connectToDatabase();
    
    // Find token in database
    const resetRequest = await db.collection('passwordResets').findOne({ token });
    
    if (!resetRequest) {
      return NextResponse.json(
        { error: 'Token not found' },
        { status: 400 }
      );
    }
    
    // Check if token is expired
    if (new Date() > new Date(resetRequest.expiresAt)) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 400 }
      );
    }
    
    // Hash the new password
    const hashedPassword = await hashPassword(password);
    
    // Update user's password
    const updateResult = await db.collection('users').updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        } 
      }
    );
    
    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Delete the used token
    await db.collection('passwordResets').deleteOne({ token });
    
    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    });
    
  } catch (error: any) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 }
    );
  }
}