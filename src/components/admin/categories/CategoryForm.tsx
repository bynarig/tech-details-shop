"use client";

import { useState } from "react";
import { Category } from "@/types";

interface CategoryFormProps {
  category: Category;
  isNew: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CategoryForm({ category, isNew, onSuccess, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState<Category>(category);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }
  
  function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-');     // Replace multiple hyphens with single one
  }
  
  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      // Only auto-generate slug if slug is empty or matches previous auto-generated slug
      slug: !prev.slug || prev.slug === generateSlug(prev.name) ? generateSlug(name) : prev.slug
    }));
  }
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const url = isNew 
        ? '/api/admin/categories' 
        : `/api/admin/categories/${category.id}`;
      
      const method = isNew ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to save category');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Category Name</span>
        </label>
        <input 
          type="text" 
          name="name"
          value={formData.name} 
          onChange={handleNameChange}
          className="input input-bordered" 
          required 
        />
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Slug (URL)</span>
        </label>
        <input 
          type="text" 
          name="slug"
          value={formData.slug} 
          onChange={handleChange}
          className="input input-bordered" 
          required 
        />
        <label className="label">
          <span className="label-text-alt">Used in URLs: example.com/category/{formData.slug}</span>
        </label>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <button 
          type="button"
          className="btn btn-outline" 
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : isNew ? 'Create Category' : 'Update Category'}
        </button>
      </div>
    </form>
  );
}