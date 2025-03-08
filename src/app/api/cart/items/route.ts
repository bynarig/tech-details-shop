import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getUserFromToken } from '@/lib/auth/serverAuthUtils';
import { ObjectId } from 'mongodb';

export const runtime = 'nodejs';

// POST: Add a new item to cart
export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const item = await request.json();
    
    // Validate the item
    if (!item.id || !item.name || item.price === undefined || item.quantity === undefined) {
      return NextResponse.json(
        { error: 'Invalid item format. Required fields: id, name, price, quantity' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Check if the cart exists
    const cart = await db.collection('carts').findOne({ userId: user._id });
    
    if (cart) {
      // Check if the item already exists in the cart
      const existingItemIndex = cart.items?.findIndex((cartItem: any) => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        await db.collection('carts').updateOne(
          { userId: user._id, "items.id": item.id },
          { 
            $inc: { 
              "items.$.quantity": item.quantity 
            },
            $set: { updatedAt: new Date() }
          }
        );
      } else {
        // Add new item to cart
        await db.collection('carts').updateOne(
          { userId: user._id },
          { 
            $push: { items: item },
            $set: { updatedAt: new Date() }
          }
        );
      }
    } else {
      // Create new cart with item
      await db.collection('carts').insertOne({
        userId: user._id,
        items: [item],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Item added to cart',
      item: item
    });
  } catch (error: any) {
    console.error('Failed to add item to cart:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a cart item
export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const { id, quantity } = await request.json();
    
    if (!id || quantity === undefined) {
      return NextResponse.json(
        { error: 'Item id and quantity are required' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Check if item with this id exists in the cart
    const cart = await db.collection('carts').findOne({ 
      userId: user._id,
      "items.id": id 
    });
    
    if (!cart) {
      return NextResponse.json(
        { error: 'Item not found in cart' },
        { status: 404 }
      );
    }
    
    if (quantity > 0) {
      // Update item quantity
      await db.collection('carts').updateOne(
        { userId: user._id, "items.id": id },
        { 
          $set: { 
            "items.$.quantity": quantity,
            updatedAt: new Date() 
          }
        }
      );
      
      return NextResponse.json({ 
        success: true,
        message: 'Item quantity updated',
        id,
        quantity
      });
    } else {
      // If quantity is 0 or negative, remove the item
      await db.collection('carts').updateOne(
        { userId: user._id },
        {
          $pull: { items: { id: id } },
          $set: { updatedAt: new Date() }
        }
      );
      
      return NextResponse.json({ 
        success: true,
        message: 'Item removed from cart due to zero quantity',
        id
      });
    }
  } catch (error: any) {
    console.error('Failed to update cart item:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove an item from the cart
export async function DELETE(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }
    
    const id = request.nextUrl.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Item id is required' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Remove item from cart
    await db.collection('carts').updateOne(
      { userId: user._id },
      {
        $pull: { items: { id: id } },
        $set: { updatedAt: new Date() }
      }
    );
    
    return NextResponse.json({ 
      success: true,
      message: 'Item removed from cart',
      id
    });
  } catch (error: any) {
    console.error('Failed to remove item from cart:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}