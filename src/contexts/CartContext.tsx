"use client";

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useState } from 'react';
import { setCart } from '@/store/slices/cartSlice';
import { loadCartFromDatabase } from '@/lib/cart/cartUtils';
import { useAuth } from './AuthContext';

type CartContextType = {
  isInitialized: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const { user, loading } = useAuth();
  const { items } = useSelector((state: RootState) => state.cart);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from database when user logs in
  useEffect(() => {
    const initializeCart = async () => {
      if (!loading) {
        if (user) {
          // User is logged in, load cart from database
          const cartItems = await loadCartFromDatabase();
          if (cartItems) {
            dispatch(setCart(cartItems));
          }
        }
        setIsInitialized(true);
      }
    };

    initializeCart();
  }, [user, loading, dispatch]);

  return (
    <CartContext.Provider value={{ isInitialized }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}