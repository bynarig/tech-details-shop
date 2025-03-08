import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getUserFromToken } from '@/lib/auth/serverAuthUtils';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 401 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Get all categories
    const categories = await db.collection('categories').find().toArray();
    
    // Get product counts for each category
    const categoryCounts = await db.collection('products').aggregate([
      { $group: { _id: "$categorySlug", count: { $sum: 1 } } }
    ]).toArray();
    
    // Create a map of category slugs to product counts
    const countMap = new Map();
    categoryCounts.forEach(item => {
      countMap.set(item._id, item.count);
    });
    
    // Add product count to each category
    const categoriesWithCount = categories.map(category => ({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      productCount: countMap.get(category.slug) || 0
    }));
    
    return NextResponse.json(categoriesWithCount);
  } catch (error: any) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 401 }
      );
    }
    
    const categoryData = await request.json();
    
    // Validate required fields
    if (!categoryData.name || !categoryData.slug) {
      return NextResponse.json(
        { message: 'Name and slug are required' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Check if slug is already used
    const existingCategory = await db.collection('categories').findOne({ 
      slug: categoryData.slug 
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { message: 'A category with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Create new category
    const result = await db.collection('categories').insertOne({
      name: categoryData.name,
      slug: categoryData.slug,
      createdAt: new Date()
    });
    
    return NextResponse.json({
      id: result.insertedId,
      ...categoryData
    }, { status: 201 });
  } catch (error: any) {
    console.error('Failed to create category:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}