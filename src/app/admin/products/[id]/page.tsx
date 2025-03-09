"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import ProductForm from "@/components/admin/products/ProductForm";
import { Product } from "@/types";

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  const isNewProduct = id === "new";

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      if (isNewProduct) {
        // Initialize a new empty product with proper default values
        const newProduct: Product = {
          id: "",
          name: "",
          slug: "",
          description: "",
          price: 0,
          categorySlug: "",
          images: [""],
          inStock: true,
          features: [""],
          specifications: {},
          compatibility: [""],
          stock: 0,
          categories: [],
          sku: ""
        };
        setProduct(newProduct);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/admin/products/${id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch product");
        }
        
        const data = await response.json();
        
        // Ensure arrays are properly initialized
        const sanitizedProduct: Product = {
          ...data,
          images: Array.isArray(data.images) ? data.images : [""],
          features: Array.isArray(data.features) ? data.features : [""],
          compatibility: Array.isArray(data.compatibility) ? data.compatibility : [""],
          categories: Array.isArray(data.categories) ? data.categories : []
        };
        
        setProduct(sanitizedProduct);
      } catch (err: any) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, isNewProduct]);

  const handleSuccess = () => {
    router.push("/admin/products");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  // Only render the form if product is not null
  if (!product) {
    return <div className="alert alert-error">Product not found</div>;
  }

  return (
    <div>

      
      <ProductForm 
        product={product} 
        isNew={isNewProduct} 
        onSuccess={handleSuccess} 
      />
    </div>
  );
}