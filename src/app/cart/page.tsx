"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCart } from '@/store/slices/cartSlice';
import { loadCartFromDatabase } from '@/lib/cart/cartUtils';
import { useAuth } from '@/contexts/AuthContext';
import Cart from '@/components/cart/Cart';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export default function CartPage() {
  const { user, loading } = useAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadCart = async () => {
      // If user is logged in, load their cart from the database
      if (user && !loading) {
        const cartItems = await loadCartFromDatabase();
        if (cartItems) {
          dispatch(setCart(cartItems));
        }
      }
    };

    loadCart();
  }, [user, loading, dispatch]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="container mx-auto px-4">
          <Cart />
        </div>
      </main>
      <Footer />
    </>
  );
}