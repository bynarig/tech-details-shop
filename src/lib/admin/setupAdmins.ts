import { connectToDatabase } from '@/lib/db/mongodb';
import { hashPassword } from '@/lib/auth/serverAuthUtils';

export async function setupAdminUsers() {
  console.log('Setting up admin users...');
  
  try {
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || [];
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD;
    
    if (!adminEmails.length) {
      console.log('No admin emails configured in environment variables.');
      return;
    }
    
    if (!defaultPassword) {
      console.error('DEFAULT_ADMIN_PASSWORD not set in environment variables.');
      return;
    }
    
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    // Process each admin email
    const results = await Promise.all(adminEmails.map(async (email) => {
      const trimmedEmail = email.trim().toLowerCase();
      
      // Check if user exists
      const existingUser = await usersCollection.findOne({ email: trimmedEmail });
      
      if (existingUser) {
        // User exists, update role to admin if not already
        if (existingUser.role !== 'admin') {
          await usersCollection.updateOne(
            { email: trimmedEmail },
            { $set: { role: 'admin', updatedAt: new Date() } }
          );
          return `Updated user ${trimmedEmail} to admin role`;
        }
        return `User ${trimmedEmail} already has admin role`;
      } else {
        // User doesn't exist, create new admin user
        const hashedPassword = await hashPassword(defaultPassword);
        
        const newAdmin = {
          name: `Admin (${trimmedEmail})`,
          email: trimmedEmail,
          password: hashedPassword,
          role: 'admin',
          cart: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await usersCollection.insertOne(newAdmin);
        return `Created new admin user with email ${trimmedEmail}`;
      }
    }));
    
    // Log results
    results.forEach(result => console.log(result));
    console.log('Admin setup completed successfully');
    
  } catch (error) {
    console.error('Error setting up admin users:', error);
  }
}