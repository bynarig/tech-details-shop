import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getUserFromToken, hashPassword } from '@/lib/auth/serverAuthUtils';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate admin
    const admin = await getUserFromToken();
    
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Get user by ID
    let userId;
    try {
      userId = new ObjectId(params.id);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    const user = await db.collection('users').findOne(
      { _id: userId },
      { projection: { password: 0 } } // Exclude password
    );
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Format user data
    const formattedUser = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      cart: user.cart || []
    };
    
    return NextResponse.json(formattedUser);
  } catch (error: any) {
    console.error('Failed to fetch user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate admin
    const admin = await getUserFromToken();
    
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Get user by ID
    let userId;
    try {
      userId = new ObjectId(params.id);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    // Get update data
    const updateData = await request.json();
    const updateFields: any = {};
    
    // Only allow certain fields to be updated
    if (updateData.name) updateFields.name = updateData.name;
    if (updateData.email) updateFields.email = updateData.email.toLowerCase();
    if (updateData.role) updateFields.role = updateData.role;
    
    // If password is provided, hash it
    if (updateData.password) {
      updateFields.password = await hashPassword(updateData.password);
    }
    
    // Add update timestamp
    updateFields.updatedAt = new Date();
    
    // Update user
    const result = await db.collection('users').updateOne(
      { _id: userId },
      { $set: updateFields }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'User updated successfully'
    });
  } catch (error: any) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { error: 'Failed to update user', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate admin
    const admin = await getUserFromToken();
    
    if (!admin || admin.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 403 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Get user by ID
    let userId;
    try {
      userId = new ObjectId(params.id);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid user ID' },
        { status: 400 }
      );
    }
    
    // Prevent deleting self
    if (admin._id.toString() === params.id) {
      return NextResponse.json(
        { error: 'Cannot delete your own admin account' },
        { status: 400 }
      );
    }
    
    // Delete user
    const result = await db.collection('users').deleteOne({ _id: userId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    console.error('Failed to delete user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user', details: error.message },
      { status: 500 }
    );
  }
}