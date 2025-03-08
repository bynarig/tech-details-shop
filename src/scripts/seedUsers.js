import 'dotenv/config';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';

// Option 2: If you need the dotenv object, import it like this:
// import dotenv from 'dotenv';
// dotenv.config();

// Connection string - use your actual MongoDB URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tech-details-shop';
console.log('MongoDB URI:', uri.includes('@') ? '***hidden***' : uri);

// Number of users to generate
const NUM_NORMAL_USERS = 20;


async function seedUsers() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const usersCollection = db.collection('users');
    
    // Check if users already exist
    // const existingUsers = await usersCollection.countDocuments({});
    // if (existingUsers > 0) {
    //   console.log(`Database already has ${existingUsers} users. Skipping seeding.`);
    //   console.log('To re-seed, first drop the users collection.');
    //   return;
    // }
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = {
      name: 'User',
      email: 'User@example.com',
      password: adminPassword,
      role: 'user',
      cart: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Create regular users
    const users = [];
    for (let i = 0; i < NUM_NORMAL_USERS; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      
      const user = {
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: await bcrypt.hash('password123', 10),
        role: 'user',
        cart: generateRandomCart(),
        createdAt: faker.date.past(),
        updatedAt: new Date()
      };
      
      users.push(user);
    }
    
    // Insert admin user
    await usersCollection.insertOne(adminUser);
    console.log('Admin user created');
    
    // Insert regular users
    if (users.length > 0) {
      const result = await usersCollection.insertMany(users);
      console.log(`${result.insertedCount} regular users created`);
    }
    
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

function generateRandomCart() {
  // Sample product data
  const products = [
    { id: '1', name: 'iPhone 15 Screen', price: 129.99, category: 'screens', image: '/images/products/iphone-screen.jpg' },
    { id: '2', name: 'Samsung Battery', price: 49.99, category: 'batteries', image: '/images/products/samsung-battery.jpg' },
    { id: '3', name: 'Pixel Case', price: 24.99, category: 'cases', image: '/images/products/pixel-case.jpg' },
    { id: '4', name: 'USB-C Charging Port', price: 15.99, category: 'charging-ports', image: '/images/products/usb-c-port.jpg' },
    { id: '5', name: 'iPhone Camera Module', price: 79.99, category: 'cameras', image: '/images/products/iphone-camera.jpg' },
  ];
  
  // Determine if the user has items in cart (30% chance)
  if (Math.random() > 0.3) {
    return []; // Empty cart
  }
  
  const cart = [];
  // Add 1-3 random items to cart
  const itemCount = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < itemCount; i++) {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === randomProduct.id);
    
    if (existingItem) {
      existingItem.quantity += Math.floor(Math.random() * 3) + 1;
    } else {
      cart.push({
        ...randomProduct,
        quantity: Math.floor(Math.random() * 3) + 1
      });
    }
  }
  
  return cart;
}

// Execute the seed function
seedUsers()
  .then(() => console.log('Seeding completed'))
  .catch(error => console.error('Seeding failed:', error));