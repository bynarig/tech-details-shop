"use client";

// Client-safe authentication utilities (no server-only imports)
import { jwtVerify } from 'jose';

// Types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

// Get token from cookies (client-side)
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; auth-token=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Client-side login function
export async function login(email: string, password: string): Promise<{ success: boolean, user?: User, error?: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Login failed' };
    }
    
    return { success: true, user: data.user };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}

// Client-side registration function
export async function register(name: string, email: string, password: string): Promise<{ success: boolean, user?: User, error?: string }> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include',
    });

    const data = await response.json();
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Registration failed' };
    }
    
    return { success: true, user: data.user };
  } catch (error: any) {
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
}

// Client-side logout function
// Client-side logout function
export async function logout(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    
    if (response.ok) {
      // Clear any client-side state related to authentication
      // For example, if you're using Redux, dispatch a logout action
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to logout:', error);
    return false;
  }
}

// Client-side function to fetch current user
export async function fetchCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/user', {
      credentials: 'include',
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
}