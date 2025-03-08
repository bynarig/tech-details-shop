import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getUserFromToken } from '@/lib/auth/serverAuthUtils';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 401 }
      );
    }
    
    const id = params.id;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid category ID' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    const category = await db.collection('categories').findOne({ 
      _id: new ObjectId(id) 
    });
    
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug
    });
  } catch (error: any) {
    console.error('Failed to fetch category:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 401 }
      );
    }
    
    const id = params.id;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid category ID' },
        { status: 400 }
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
    
    // Check if slug is already used by another category
    const existingCategory = await db.collection('categories').findOne({ 
      slug: categoryData.slug,
      _id: { $ne: new ObjectId(id) }
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { message: 'A category with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Update category
    const result = await db.collection('categories').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: {
          name: categoryData.name,
          slug: categoryData.slug,
          updatedAt: new Date()
        }
      }
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Update product categories if slug changed
    if (categoryData.oldSlug && categoryData.oldSlug !== categoryData.slug) {
      await db.collection('products').updateMany(
        { categorySlug: categoryData.oldSlug },
        { 
          $set: {
            category: categoryData.name,
            categorySlug: categoryData.slug
          }
        }
      );
    }
    
    return NextResponse.json({
      id: id,
      ...categoryData
    });
  } catch (error: any) {
    console.error('Failed to update category:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserFromToken();
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Not authorized' },
        { status: 401 }
      );
    }
    
    const id = params.id;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Invalid category ID' },
        { status: 400 }
      );
    }
    
    const { db } = await connectToDatabase();
    
    // Check if category is used by any products
    const category = await db.collection('categories').findOne({ _id: new ObjectId(id) });
    
    if (!category) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    const productsUsingCategory = await db.collection('products').countDocuments({
      categorySlug: category.slug
    });
    
    if (productsUsingCategory > 0) {
      return NextResponse.json(
        { 
          message: `Cannot delete: ${productsUsingCategory} product(s) are using this category. 
                   Please reassign these products to another category first.` 
        },
        { status: 400 }
      );
    }
    
    // Delete category
    const result = await db.collection('categories').deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      message: 'Category deleted successfully',
      id: id
    });
  } catch (error: any) {
    console.error('Failed to delete category:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}