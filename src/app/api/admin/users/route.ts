import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getUserFromToken } from '@/lib/auth/serverAuthUtils';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getUserFromToken();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    if (user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50'); // Default to 50 users per page
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search');
    const role = searchParams.get('role'); // Filter by role (admin, user)
    
    // Build query
    const query: any = {};
    
    if (role) {
      query.role = role;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get total count for pagination
    const total = await db.collection('users').countDocuments(query);
    
    // Get users
    const users = await db.collection('users')
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .project({ password: 0 }) // Exclude password field
      .toArray();
    
    // Format users for response
    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      cart: user.cart || [],
      totalOrders: 0, // This would be populated from orders collection in a more complex query
      lastLogin: user.lastLogin || null
    }));
    
    return NextResponse.json({
      users: formattedUsers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalUsers: total
    });
  } catch (error: any) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate admin user
    const admin = await getUserFromToken();
    
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    const userData = await request.json();
    
    // Validate required fields
    if (!userData.name || !userData.email || !userData.password) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Check if user with this email already exists
    const existingUser = await db.collection('users').findOne({ email: userData.email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Create new user (using your existing auth utilities)
    const { createUser } = await import('@/lib/auth/serverAuthUtils');
    const newUser = await createUser(userData.name, userData.email.toLowerCase(), userData.password);
    
    // If admin wants to create another admin, set the role explicitly
    if (userData.role === 'admin') {
      await db.collection('users').updateOne(
        { _id: new ObjectId(newUser._id) },
        { $set: { role: 'admin' } }
      );
      newUser.role = 'admin';
    }
    
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create user:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}