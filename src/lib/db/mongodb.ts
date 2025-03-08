import { MongoClient } from 'mongodb';

// Connection string from environment variable
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tech-details-shop';

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cachedClient: MongoClient | null = null;
let cachedPromise: Promise<MongoClient> | null = null;

export async function connectToDatabase() {
  // If we already have a cached client, use it
  if (cachedClient) {
    return { client: cachedClient, db: cachedClient.db() };
  }

  // If we have a cached promise, wait for it to resolve
  if (!cachedPromise) {
    // Create a new connection promise if none exists
    cachedPromise = MongoClient.connect(uri)
      .then(client => {
        cachedClient = client;
        return client;
      })
      .catch(err => {
        console.error('MongoDB connection error:', err);
        cachedPromise = null;
        throw err;
      });
  }

  try {
    const client = await cachedPromise;
    const db = client.db();
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Export a simple function to test connection
export async function verifyDbConnection(): Promise<boolean> {
  try {
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    console.log('✅ MongoDB connection verified successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection verification failed:', error);
    return false;
  }
}