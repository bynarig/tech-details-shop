"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Product } from '@/types';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  
  useEffect(() => {
    fetchProducts();
  }, [currentPage, category, search]);
  
  async function fetchProducts() {
    try {
      setLoading(true);
      
      // Build query params
      let url = `/api/admin/products?page=${currentPage}`;
      if (category) url += `&category=${category}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data = await response.json();
      
      // Check if response has products property (paginated response)
      if (data.products) {
        setProducts(data.products);
        setTotalPages(data.totalPages || 1);
      } else if (Array.isArray(data)) {
        // Direct array response
        setProducts(data);
      } else {
        // Unexpected format
        setProducts([]);
        console.error('Unexpected API response format:', data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setProducts(products.filter(product => product.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  }

  if (loading) {
    return <div className="loading loading-spinner loading-lg"></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new" className="btn btn-primary">
          <span className="material-symbols-outlined">add</span>
          Add New Product
        </Link>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="avatar">
                    <div className="w-12 h-12 mask mask-squircle">
                      <img 
                        src={product.images[0] || "https://placehold.co/100"} 
                        alt={product.name}
                      />
                    </div>
                  </div>
                </td>
                <td>{product.name}</td>
                <td>{product.categories[0]}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <span className={`badge ${product.inStock ? 'badge-success' : 'badge-error'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <Link 
                      href={`/admin/products/${product.id}`}
                      className="btn btn-sm btn-info"
                    >
                      <span className="material-symbols-outlined">edit</span>
                    </Link>
                    <button 
                      className="btn btn-sm btn-error"
                      onClick={() => handleDelete(product.id)}
                    >
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}