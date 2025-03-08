import { ObjectId } from 'mongodb';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
}

export interface User {
  _id?: ObjectId;
  name: string;
  role: string;
  email: string;
  password: string; // This should be hashed!
  cart: CartItem[];  // Add cart array to user model
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserWithoutPassword {
  _id?: ObjectId;
  name: string;
  role: string;
  email: string;
  cart: CartItem[]; // Add cart array here too
  createdAt: Date;
  updatedAt?: Date;
}

// Helper function to remove password from user object
export function excludePassword(user: User): UserWithoutPassword {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}