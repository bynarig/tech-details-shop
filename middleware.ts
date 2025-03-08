import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// Define which routes require authentication
const protectedRoutes = ['/account', '/account/orders', '/checkout'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const path = request.nextUrl.pathname;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.some(route => path === route);

  if (isProtectedRoute) {
    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(
        new URL(`/login?returnUrl=${encodeURIComponent(path)}`, request.url)
      );
    }

    try {
      // Only verify JWT structure (NOT doing database lookups here)
      jwtVerify(
        token, 
        new TextEncoder().encode(process.env.JWT_SECRET || 'replace-with-secure-secret-in-env-file')
      );
      
      // Token structure is valid, continue to protected route
      return NextResponse.next();
    } catch (error) {
      // Invalid token
      return NextResponse.redirect(
        new URL(`/login?returnUrl=${encodeURIComponent(path)}`, request.url)
      );
    }
  }

  if (isAuthRoute && token) {
    try {
      // Only verify JWT structure (NOT doing database lookups here)
      jwtVerify(
        token, 
        new TextEncoder().encode(process.env.JWT_SECRET || 'replace-with-secure-secret-in-env-file')
      );
      
      // Token structure is valid, redirect to account
      return NextResponse.redirect(new URL('/account', request.url));
    } catch (error) {
      // Token is invalid, allow access to auth routes
      return NextResponse.next();
    }
  }

  // For all other routes, continue
  return NextResponse.next();
}

// Static configuration - this is important to avoid dynamic expressions
export const config = {
  matcher: [
    '/account', 
    '/account/:path*', 
    '/checkout', 
    '/checkout/:path*',
    '/login',
    '/register'
  ]
};