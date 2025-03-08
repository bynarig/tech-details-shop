"use client";

import { useState } from "react";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import ProductCard from "@/components/ui/ProductCard";
import Hero from "@/components/ui/Hero";
import CategoryFilter from "@/components/ui/CategoryFilter";
import { products, categories } from "@/lib/data";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === categories.find(c => c.id === selectedCategory)?.slug) 
    : products;

  return (
    <>
      <Navbar />
      <main className="min-h-screen container mx-auto px-4">
        <Hero />
        
        <section className="py-10">
          <h2 className="text-3xl font-bold mb-6 text-center">Featured Products</h2>
          
          <CategoryFilter 
            categories={categories} 
            onSelectCategory={setSelectedCategory}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-10">
              <h3 className="text-xl">No products found in this category</h3>
              <button 
                className="btn btn-primary mt-4"
                onClick={() => setSelectedCategory(null)}
              >
                View All Products
              </button>
            </div>
          )}
        </section>
        
        <section className="py-10">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">Why Choose Tech Details Shop?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary rounded-full p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Genuine Parts</h3>
                  <p className="mt-2">We only sell genuine and high-quality replacement parts.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary rounded-full p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Fast Delivery</h3>
                  <p className="mt-2">Quick and reliable shipping to get your parts on time.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary rounded-full p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Expert Support</h3>
                  <p className="mt-2">Our technicians are available to help with your repairs.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}