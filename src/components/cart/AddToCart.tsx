"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItem } from "@/store/slices/cartSlice";
import { Product } from "@/lib/data/productData";

interface AddToCartProps {
  product: Product;
}

export default function AddToCart({ product }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    setIsAdding(true);
    
    dispatch(
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.images[0],
        category: product.category
      })
    );
    
    // Show success message for 2 seconds
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
    
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <button
            className="btn btn-outline btn-square btn-sm"
            onClick={() => quantity > 1 && setQuantity(quantity - 1)}
            disabled={quantity <= 1 || !product.inStock}
          >
            -
          </button>
          <span className="mx-3 min-w-10 text-center">{quantity}</span>
          <button
            className="btn btn-outline btn-square btn-sm"
            onClick={() => setQuantity(quantity + 1)}
            disabled={!product.inStock}
          >
            +
          </button>
        </div>
        
        <button
          className="btn btn-primary flex-grow"
          onClick={handleAddToCart}
          disabled={!product.inStock || isAdding}
        >
          {isAdding ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <span>Add to Cart</span>
          )}
        </button>
      </div>
      
      {showSuccess && (
        <div className="alert alert-success shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Item added to your cart!</span>
          </div>
        </div>
      )}
      
      {!product.inStock && (
        <div className="alert alert-error shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Sorry, this item is out of stock.</span>
          </div>
        </div>
      )}
    </div>
  );
}