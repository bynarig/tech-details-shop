// SERVER-SIDE ONLY - DO NOT IMPORT IN CLIENT COMPONENTS
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../db/mongodb';
import { cookies } from 'next/headers'; 
import { SignJWT, jwtVerify } from 'jose';
import { ObjectId } from 'mongodb';

// Secret key for JWT
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'replace-with-secure-secret-key'
);

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function checkIfUserExists(email: string): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });
    return !!user;
  } catch (error) {
    console.error('Error checking if user exists:', error);
    throw error;
  }
}

export async function createUser(name: string, email: string, password: string): Promise<any> {
  const hashedPassword = await hashPassword(password);
  
  const { db } = await connectToDatabase();
  
  const newUser = {
    name,
    email,
    password: hashedPassword,
    role: 'user', // Set default role to 'user'
    cart: [], // Initialize empty cart
    createdAt: new Date()
  };
  
  const result = await db.collection('users').insertOne(newUser);
  
  const { password: _, ...userWithoutPassword } = newUser;
  return { _id: result.insertedId, ...userWithoutPassword };
}

export async function createSession(userId: string) {
  // Create token
  const token = await new SignJWT({ id: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'auth-token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'lax', // Changed from 'strict' to 'lax'
  });

  return token;
}

export async function getUserFromToken() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;
    
    if (!token) {
      return null;
    }
    
    const { payload } = await jwtVerify(
      token,
      JWT_SECRET
    );
    
    if (!payload || !payload.id) {
      return null;
    }
    
    const { db } = await connectToDatabase();
    
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(payload.id as string),
    });
    
    if (!user) {
      return null;
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    
    // Ensure role is included in the returned user object
    return { 
      ...userWithoutPassword, 
      _id: user._id.toString(),
      // Make sure role is explicitly included (even though it should be in userWithoutPassword)
      role: user.role || 'user' // Default to 'user' if role is not defined
    };
  } catch (error) {
    console.error('Error getting user from token:', error);
    return null;
  }
}

// Add this function if it doesn't exist or modify it if it does
export function clearAuthCookie(response: NextResponse) {
  // Set the auth cookie to expire immediately (in the past)
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax', // Changed from 'strict' to 'lax' for better compatibility
    expires: new Date(0), // Set to Unix epoch (Jan 1, 1970) to immediately expire
    path: '/',
  });
  
  return response;
}