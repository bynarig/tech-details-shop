import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../db/mongodb';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { ObjectId } from 'mongodb';
import { User, excludePassword } from '../models/userModel';

// Secret key for JWT
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'replace-with-secure-secret-in-env-file'
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

export async function createUser(name: string, email: string, password: string) {
  try {
    const { db } = await connectToDatabase();
    
    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    const now = new Date();
    const user: User = {
      name,
      email,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    };
    
    // Insert the new user
    const result = await db.collection('users').insertOne(user);
    
    // Return user without password
    return {
      _id: result.insertedId,
      ...excludePassword(user)
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function createSession(userId: string) {
	// Create token
	const token = await new SignJWT({ id: userId })
	  .setProtectedHeader({ alg: 'HS256' })
	  .setExpirationTime('7d')
	  .sign(JWT_SECRET);
  
	// Set cookie - THIS IS THE FIX
	const cookieStore = cookies();
	await cookieStore.set({
	  name: 'auth-token',
	  value: token,
	  httpOnly: true,
	  path: '/',
	  secure: process.env.NODE_ENV !== 'development',
	  maxAge: 60 * 60 * 24 * 7, // 1 week
	  sameSite: 'strict',
	});
  
	return token;
  }
export async function getUserFromToken() {
  const token = cookies().get('auth-token')?.value;
  if (!token) return null;

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const userId = verified.payload.id as string;

    const client = await clientPromise;
    const user = await client.db().collection('users').findOne({ _id: new ObjectId(userId) });
    
    if (!user) return null;
    
    return excludePassword(user as User);
  } catch (error) {
    return null;
  }
}

export async function logout() {
  cookies().delete('auth-token');
  return true;
}