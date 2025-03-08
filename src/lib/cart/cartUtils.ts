import { CartItem } from "@/store/slices/cartSlice";
import { getUserFromToken } from "../auth/serverAuthUtils";
import { connectToDatabase } from "../db/mongodb";

export async function syncCartWithDatabase(cartItems: CartItem[]): Promise<void> {
  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items: cartItems }),
      credentials: 'include',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to sync cart');
    }
  } catch (error) {
    console.error('Error syncing cart with database:', error);
  }
}

/**
 * Load cart data from database for logged-in user
 */
export async function loadCartFromDatabase(): Promise<CartItem[] | null> {
  try {
    const response = await fetch('/api/cart', {
      credentials: 'include',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to load cart');
    }

    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error loading cart from database:', error);
    return null;
  }
}

/**
 * Add a single item to the cart
 */
export async function addItemToCart(item: CartItem): Promise<boolean> {
  try {
    const response = await fetch('/api/cart/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to add item to cart');
    }

    return true;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return false;
  }
}

/**
 * Update item quantity in cart
 */
export async function updateCartItemQuantity(id: string, quantity: number): Promise<boolean> {
  try {
    const response = await fetch('/api/cart/items', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, quantity }),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to update item quantity');
    }

    return true;
  } catch (error) {
    console.error('Error updating item quantity:', error);
    return false;
  }
}

/**
 * Remove item from cart
 */
export async function removeCartItem(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/cart/items?id=${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to remove item from cart');
    }

    return true;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return false;
  }
}

/**
 * Clear the entire cart
 */
export async function clearCart(): Promise<boolean> {
  try {
    const response = await fetch('/api/cart', {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to clear cart');
    }

    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
}