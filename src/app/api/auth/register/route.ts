import { NextRequest, NextResponse } from 'next/server';
import { createUser, createSession, checkIfUserExists } from '@/lib/auth/authUtils';

// Explicitly set Node.js runtime - this is critical
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    try {
      // First check if the email already exists
      const emailExists = await checkIfUserExists(email);
      
      if (emailExists) {
        return NextResponse.json(
          { 
            error: 'This email is already registered',
            code: 'EMAIL_EXISTS',
            message: 'You already have an account with this email. Please log in instead.'
          },
          { status: 409 }
        );
      }
      
      // If email doesn't exist, proceed with user creation
      const user = await createUser(name, email, password);
      
      if (!user) {
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        );
      }

      // Create session (JWT token in cookie)
      await createSession(user._id!.toString());
      
      return NextResponse.json({ 
        success: true, 
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (dbError: any) {
      console.error("Database error during registration:", dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: `Server error: ${error.message}` },
      { status: 500 }
    );
  }
}