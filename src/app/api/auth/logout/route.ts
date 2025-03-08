import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie } from '@/lib/auth/serverAuthUtils';

export async function POST(request: NextRequest) {
  try {
    // Clear authentication cookie
    const response = NextResponse.json({ success: true });
    
    // Add the cookie clearing function
    clearAuthCookie(response);
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}