import { NextRequest, NextResponse } from 'next/server';
import { checkIfUserExists, createUser, createSession } from '@/lib/auth/serverAuthUtils';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    
    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const exists = await checkIfUserExists(email);
    
    if (exists) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }
    
    // Create user
    const user = await createUser(name, email, password);
    
    // Create session - sets the HTTP cookie
    await createSession(user._id.toString());
    
    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}