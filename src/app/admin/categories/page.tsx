"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Category } from "@/types";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import { useRouter } from "next/navigation";

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await fetch('/api/admin/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this category? This may affect products using this category.')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setCategories(categories.filter(category => category.id !== id));
      } else {
        const error = await response.json();
        alert(`Failed to delete: ${error.message || 'Category may be in use by products'}`);
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  }

  const handleFormSuccess = () => {
    fetchCategories();
    setIsAddModalOpen(false);
    setEditingCategory(null);
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          <span className="material-symbols-outlined">add</span>
          Add New Category
        </button>
      </div>

      {/* Search */}
      <div className="form-control mb-6 max-w-xs">
        <div className="input-group">
          <input 
            type="text" 
            placeholder="Search categories..." 
            className="input input-bordered w-full" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-square">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Categories List */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Products</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  {searchQuery ? 'No categories match your search.' : 'No categories found. Add your first category!'}
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr key={category.id} className="hover">
                  <td className="font-medium">{category.name}</td>
                  <td className="text-gray-600">{category.slug}</td>
                  <td>{category.productCount || 0}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button 
                        className="btn btn-sm btn-info"
                        onClick={() => setEditingCategory(category)}
                      >
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button 
                        className="btn btn-sm btn-error"
                        onClick={() => handleDelete(category.id)}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add New Category</h3>
            <CategoryForm 
              category={{ id: '', name: '', slug: '' }}
              isNew={true}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsAddModalOpen(false)}
            />
          </div>
          <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}></div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit Category</h3>
            <CategoryForm 
              category={editingCategory}
              isNew={false}
              onSuccess={handleFormSuccess}
              onCancel={() => setEditingCategory(null)}
            />
          </div>
          <div className="modal-backdrop" onClick={() => setEditingCategory(null)}></div>
        </div>
      )}
    </div>
  );
}