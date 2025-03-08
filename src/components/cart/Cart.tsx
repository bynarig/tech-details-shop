"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { removeItem, updateQuantity, clearCart } from '@/store/slices/cartSlice';
import { useAuth } from '@/contexts/AuthContext';
import { syncCartWithDatabase } from '@/lib/cart/cartUtils';

export default function Cart() {
  const { items, totalItems, totalAmount } = useSelector((state: RootState) => state.cart);
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // If user is logged in, sync the cart with the database
    if (user) {
      syncCartWithDatabase(items);
    }
  }, [user, items]);

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeItem(itemId));
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
    } else {
      dispatch(removeItem(itemId));
    }
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link href="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart ({totalItems} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-base-100 p-6 rounded-lg shadow-md">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col md:flex-row items-start border-b py-4 last:border-b-0">
                {/* Product Image */}
                <div className="w-24 h-24 mr-4 flex-shrink-0 relative mb-4 md:mb-0">
                  <Image
                    src={item.image || "https://placehold.co/200x200?text=Product"}
                    alt={item.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">
                    <Link href={`/product/${item.id}`} className="hover:text-primary">
                      {item.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                  <div className="flex items-center justify-between flex-wrap">
                    <div className="flex items-center">
                      <span className="mr-2">Quantity:</span>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="btn btn-xs btn-outline"
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="btn btn-xs btn-outline"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center mt-2 md:mt-0">
                      <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="btn btn-ghost btn-sm ml-4"
                        aria-label="Remove item"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-between">
            <Link href="/" className="btn btn-outline">
              Continue Shopping
            </Link>
            <button onClick={handleClearCart} className="btn btn-ghost">
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-base-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link href="/checkout" className="btn btn-primary w-full mt-6">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}