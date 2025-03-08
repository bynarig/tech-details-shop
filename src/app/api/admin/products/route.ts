import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getUserFromToken } from '@/lib/auth/serverAuthUtils';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
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
    
    // Parse request body
    let productData;
    try {
      productData = await request.json();
      console.log('Received product data:', productData);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return NextResponse.json(
        { error: 'Invalid JSON data' },
        { status: 400 }
      );
    }
    
    // Validate required fields
    if (!productData.name) {
      return NextResponse.json(
        { error: 'Product name is required' },
        { status: 400 }
      );
    }
    
    // Validate price
    const price = parseFloat(productData.price);
    if (isNaN(price)) {
      return NextResponse.json(
        { error: 'Valid product price is required' },
        { status: 400 }
      );
    }
    
    // Ensure all required arrays exist
    if (!Array.isArray(productData.images)) {
      productData.images = [""];
    }
    
    if (!Array.isArray(productData.features)) {
      productData.features = [""];
    }
    
    if (!Array.isArray(productData.compatibility)) {
      productData.compatibility = [""];
    }
    
    // Ensure categories is an array
    if (!Array.isArray(productData.categories)) {
      productData.categories = productData.category ? [productData.category] : [];
    }
    
    const { db } = await connectToDatabase();
    
    // Add timestamps
    const newProduct = {
      ...productData,
      price: price,
      stock: parseInt(productData.stock || "0", 10),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Remove _id if it exists to avoid ObjectId casting issues
    delete newProduct._id;
    
    // Insert the new product
    const result = await db.collection('products').insertOne(newProduct);
    
    return NextResponse.json({
      id: result.insertedId.toString(),
      ...newProduct
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create product:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}