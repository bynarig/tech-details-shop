import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { getUserFromToken } from '@/lib/auth/serverAuthUtils';

export async function GET(request: NextRequest) {
  try {
    // Verify the user is authenticated and is an admin
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
    
    // Connect to the database
    const { db } = await connectToDatabase();
    
    // Get current date and date 30 days ago for recent orders
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    // Fetch stats from database (parallel queries for performance)
    // Replace the MongoDB queries with the correct syntax:
const [
	totalOrders,
	recentOrders,
	totalRevenue,
	totalProducts,
	lowStockProducts,
	totalCustomers
  ] = await Promise.all([
	// Total orders
	db.collection('orders').countDocuments(),
	
	// Recent orders (last 30 days)
	db.collection('orders')
	  .find({ createdAt: { $gte: thirtyDaysAgo } })
	  .count(), // Change countDocuments() to count()
	
	// Total revenue (excluding cancelled orders)
	db.collection('orders').aggregate([
	  { $match: { status: { $ne: 'cancelled' } } },
	  { $group: { _id: null, total: { $sum: '$totalAmount' } } }
	]).toArray().then(result => result[0]?.total || 0),
	
	// Total products
	db.collection('products').countDocuments(),
	
	// Low stock products
	db.collection('products')
	  .find({ stock: { $lt: 10 } })
	  .count(), // Change countDocuments() to count()
	
	// Total customers
	db.collection('users')
	  .find({ role: 'user' })
	  .count() // Change countDocuments() to count()
  ]);
    
    // Return the stats
    return NextResponse.json({
      totalOrders,
      recentOrders,
      totalRevenue,
      totalProducts,
      lowStockProducts,
      totalCustomers
    });
  } catch (error: any) {
    console.error('Failed to fetch admin stats:', error);
    return NextResponse.json(
      { error: 'Server error', details: error.message },
      { status: 500 }
    );
  }
}