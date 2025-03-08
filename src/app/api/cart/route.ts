import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getUserFromToken } from '@/lib/auth/serverAuthUtils';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// GET: Retrieve the user's cart
export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Get user document with cart
    const userDoc = await db.collection('users').findOne({ 
      _id: new ObjectId(user._id)
    });
    
    const cart = userDoc?.cart || [];
    
    // Return cart items or empty array if no cart exists
    return NextResponse.json({
      items: cart,
      totalItems: cart.reduce((total, item) => total + item.quantity, 0) || 0,
      totalAmount: cart.reduce((total, item) => total + (item.price * item.quantity), 0) || 0
    });
  } catch (error: any) {
    console.error('Failed to load cart:', error);
    return NextResponse.json(
      { error: 'Failed to load cart', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Update the entire cart
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { items } = await request.json();
    
    // Skip empty cart saves
    if (!items) {
      return NextResponse.json(
        { error: 'Invalid request, items array is required' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Save cart data directly to user document
    await db.collection('users').updateOne(
      { _id: new ObjectId(user._id) },
      { 
        $set: {
          cart: items,
          updatedAt: new Date()
        }
      }
    );
    
    return NextResponse.json({ 
      success: true,
      message: 'Cart updated successfully',
      itemCount: items.length 
    });
  } catch (error: any) {
    console.error('Failed to update cart:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}