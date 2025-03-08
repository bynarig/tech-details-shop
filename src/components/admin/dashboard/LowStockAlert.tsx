"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface LowStockProduct {
  id: string;
  name: string;
  stockLevel: number;
  category: string;
}

export default function LowStockAlert() {
  const [products, setProducts] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchLowStockProducts() {
      try {
        const response = await fetch('/api/admin/products?lowStock=true&limit=5');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          setError("Failed to load low stock products");
        }
      } catch (error) {
        console.error('Failed to fetch low stock products:', error);
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchLowStockProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Low Stock Alert</h2>
        <div className="flex justify-center my-4">
          <span className="loading loading-spinner"></span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Low Stock Alert</h2>
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Low Stock Alert</h2>
        <Link href="/admin/products" className="btn btn-sm btn-link">
          View All
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>No low stock items at the moment!</span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover">
                  <td>
                    <Link href={`/admin/products/${product.id}`} className="font-medium hover:underline">
                      {product.name}
                    </Link>
                  </td>
                  <td>{product.category}</td>
                  <td>
                    <span className={`badge ${product.stockLevel <= 0 ? 'badge-error' : 'badge-warning'}`}>
                      {product.stockLevel <= 0 ? 'Out of stock' : `${product.stockLevel} left`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}