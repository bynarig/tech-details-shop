"use client";

import { useState, useEffect } from "react";
import { Product } from "@/types";
import { useRouter } from "next/navigation";
import ImageDropzone from "@/components/admin/products/ImageComponent";
import { isValidUrl } from "@/lib/images/imgur";

interface ProductFormProps {
  product: Product;
  isNew: boolean;
  onSuccess: () => void;
}

export default function ProductForm({ product, isNew, onSuccess }: ProductFormProps) {
  // Initialize formData with default values (unchanged code)
  const [formData, setFormData] = useState<Product>({
    id: product?.id || "",
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || "",
    categorySlug: product?.categorySlug || "",
    images: Array.isArray(product?.images) && product.images.length > 0 ? product.images : [""],
    inStock: product?.inStock !== undefined ? product.inStock : true,
    features: Array.isArray(product?.features) && product.features.length > 0 ? product.features : [""],
    specifications: product?.specifications || {},
    compatibility: Array.isArray(product?.compatibility) && product.compatibility.length > 0 ? product.compatibility : [""],
    stock: product?.stock || 0,
    categories: Array.isArray(product?.categories) ? product.categories : [],
    sku: product?.sku || ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<{id: string, name: string, slug: string}[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  // New state for managing image uploads
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [showImageUploader, setShowImageUploader] = useState(false);
  
  // Rest of the existing useEffect and handlers remain the same...

  // Handle image upload completion
  const handleImageUploaded = (imageUrl: string) => {
    if (activeImageIndex !== null) {
      // Update the specific image in the array
      const updatedImages = [...formData.images];
      updatedImages[activeImageIndex] = imageUrl;
      setFormData(prev => ({
        ...prev,
        images: updatedImages
      }));
    } else {
      // Add new image if no active index
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
    }
    
    // Hide the uploader after successful upload
    setShowImageUploader(false);
    setActiveImageIndex(null);
  };
  
  // Handle image upload errors
  const handleImageUploadError = (errorMessage: string) => {
    setError(errorMessage);
    // Keep the uploader open so the user can try again
  };

  function handleImageChange(index: number, value: string) {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  }

  function addImage() {
    // Instead of directly adding an empty image, show the uploader
    setActiveImageIndex(formData.images.length);
    setShowImageUploader(true);
  }

  function removeImage(index: number) {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
    
    // If showing uploader for this index, hide it
    if (activeImageIndex === index) {
      setActiveImageIndex(null);
      setShowImageUploader(false);
    } else if (activeImageIndex !== null && activeImageIndex > index) {
      // Adjust the active index if deleting an image before it
      setActiveImageIndex(activeImageIndex - 1);
    }
  }
  
  // Function to open the uploader for a specific image
  function openUploaderForImage(index: number) {
    setActiveImageIndex(index);
    setShowImageUploader(true);
  }
  
  // Fetch categories for dropdown
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch('/api/admin/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
          
          // Initialize selected categories from product with safeguards
          if (product?.categories && Array.isArray(product.categories)) {
            // Extract IDs for the selected categories
            const categoryIds = data
              .filter(cat => product.categories.includes(cat.name))
              .map(cat => cat.id);
            setSelectedCategories(categoryIds);
          } else if (product?.category) {
            // Handle backward compatibility with old single category
            const category = data.find(c => c.name === product.category);
            if (category) {
              setSelectedCategories([category.id]);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    }

    fetchCategories();
  }, []); 

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function handleCategorySelect(categoryId: string) {
    // Toggle category selection
    const updatedCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(updatedCategories);
    
    // Get category names from selected IDs
    const categoryNames = updatedCategories
      .map(id => {
        const category = categories.find(c => c.id === id);
        return category ? category.name : null;
      })
      .filter(Boolean) as string[];
    
    // Get primary category slug for backward compatibility
    const primaryCategory = updatedCategories.length > 0
      ? categories.find(c => c.id === updatedCategories[0])
      : null;
    
    // Update form data with selected categories
    setFormData(prev => ({
      ...prev,
      categories: categoryNames, // Array of category names
      category: categoryNames[0] || '', // Primary category name
      categorySlug: primaryCategory?.slug || '' // Primary category slug
    }));
  }

  function handleStockChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFormData(prev => ({
      ...prev,
      inStock: e.target.value === 'true'
    }));
  }

  // Rest of the existing handlers remain the same...

  function handleImageChange(index: number, value: string) {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  }

  function addImage() {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }));
  }

  function removeImage(index: number) {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: updatedImages
    }));
  }

  function handleFeatureChange(index: number, value: string) {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  }

  function addFeature() {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  }

  function removeFeature(index: number) {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  }

  function handleCompatibilityChange(index: number, value: string) {
    const updatedCompatibility = [...formData.compatibility];
    updatedCompatibility[index] = value;
    setFormData(prev => ({
      ...prev,
      compatibility: updatedCompatibility
    }));
  }

  function addCompatibility() {
    setFormData(prev => ({
      ...prev,
      compatibility: [...prev.compatibility, ""]
    }));
  }

  function removeCompatibility(index: number) {
    const updatedCompatibility = formData.compatibility.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      compatibility: updatedCompatibility
    }));
  }

  // Handle specifications (key-value pairs)
  function handleSpecificationChange(key: string, value: string, isKey: boolean = false) {
    if (isKey) {
      // Rename the key while preserving the value
      const oldValue = formData.specifications[key];
      const newSpecs = { ...formData.specifications };
      delete newSpecs[key];
      newSpecs[value] = oldValue;
      
      setFormData(prev => ({
        ...prev,
        specifications: newSpecs
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [key]: value
        }
      }));
    }
  }

  function addSpecification() {
    const newKey = `spec-${Object.keys(formData.specifications).length + 1}`;
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [newKey]: ""
      }
    }));
  }

  function removeSpecification(key: string) {
    const newSpecs = { ...formData.specifications };
    delete newSpecs[key];
    setFormData(prev => ({
      ...prev,
      specifications: newSpecs
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      // Generate slug if it's empty
      const slug = formData.slug || formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
  
      // Prepare data for submission with safeguards
      const productToSubmit = {
        ...formData,
        slug,
        // Ensure these are valid values
        price: typeof formData.price === 'number' ? formData.price : parseFloat(String(formData.price || 0)),
        stock: typeof formData.stock === 'number' ? formData.stock : parseInt(String(formData.stock || 0), 10),
        inStock: Boolean(formData.inStock),
        // Ensure arrays are properly initialized
        images: Array.isArray(formData.images) ? formData.images : [""],
        features: Array.isArray(formData.features) ? formData.features : [""],
        compatibility: Array.isArray(formData.compatibility) ? formData.compatibility : [""],
        // Ensure categories is an array
        categories: Array.isArray(formData.categories) 
          ? formData.categories 
          : (formData.category ? [formData.category] : [])
      };
  
      const url = isNew 
        ? '/api/admin/products' 
        : `/api/admin/products/${formData.id}`;
      
      const method = isNew ? 'POST' : 'PUT';
  
      // Log the data being sent (for debugging)
      console.log('Sending product data:', productToSubmit);
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productToSubmit)
      });
  
      const responseData = await response.json();
      
      if (response.ok) {
        console.log('Product saved successfully:', responseData);
        onSuccess();
      } else {
        console.error('API error response:', responseData);
        setError(responseData.error || responseData.details || 'Failed to save product');
      }
    } catch (err) {
      console.error('Error saving product:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      {error && (
        <div className="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Basic Information</h3>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Name</span>
            </label>
            <input 
              type="text" 
              name="name"
              value={formData.name} 
              onChange={handleChange}
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
              placeholder="auto-generated-if-empty"
            />
          </div>
          
          {/* Multi-select Categories */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Categories</span>
            </label>
            <div className="relative">
              <button 
                type="button"
                className="input input-bordered flex justify-between items-center w-full"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <span className="truncate">
                  {selectedCategories.length === 0 
                    ? "Select categories" 
                    : selectedCategories.map(id => 
                        categories.find(c => c.id === id)?.name
                      ).filter(Boolean).join(", ")}
                </span>
                <span className="material-symbols-outlined">
                  {showCategoryDropdown ? 'arrow_drop_up' : 'arrow_drop_down'}
                </span>
              </button>
              
              {showCategoryDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-base-100 shadow-lg rounded-md border border-base-300 max-h-60 overflow-auto">
                  {categories.map((category) => (
                    <div 
                      key={category.id}
                      className={`px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-base-200 ${
                        selectedCategories.includes(category.id) ? 'bg-base-200' : ''
                      }`}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <input 
                        type="checkbox" 
                        className="checkbox checkbox-sm" 
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => {}} // Handled by parent click
                      />
                      {category.name}
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <div className="px-4 py-2 text-gray-500">No categories available</div>
                  )}
                </div>
              )}
            </div>
            
            {/* Show selected categories as badges */}
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedCategories.map(id => {
                const category = categories.find(c => c.id === id);
                return category ? (
                  <div key={id} className="badge badge-primary gap-1">
                    {category.name}
                    <button 
                      type="button" 
                      className="btn btn-ghost btn-xs btn-circle"
                      onClick={() => handleCategorySelect(id)}
                    >
                      <span className="material-symbols-outlined text-xs">close</span>
                    </button>
                  </div>
                ) : null;
              })}
            </div>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Price ($)</span>
            </label>
            <input 
              type="number" 
              name="price"
              value={formData.price} 
              onChange={handleChange}
              className="input input-bordered" 
              step="0.01"
              min="0"
              required 
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Stock Status</span>
            </label>
            <select 
              className="select select-bordered"
              value={formData.inStock.toString()}
              onChange={handleStockChange}
            >
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>
        </div>
        
        {/* Description */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b pb-2">Description</h3>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Product Description</span>
            </label>
            <textarea 
              name="description"
              value={formData.description} 
              onChange={handleChange}
              className="textarea textarea-bordered h-32" 
              required 
            />
          </div>
        </div>
      </div>
      
      {/* The rest of the form remains unchanged */}
      {/* Images */}
<div className="mt-8">
        <h3 className="text-lg font-bold border-b pb-2">Images</h3>
        
        {/* Image uploader modal/dialog */}
        {showImageUploader && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Upload Image</h3>
              <ImageDropzone 
                onImageUploaded={handleImageUploaded}
                onError={handleImageUploadError}
              />
              <div className="mt-4 flex justify-between">
                <button 
                  type="button"
                  className="btn btn-sm btn-outline"
                  onClick={() => {
                    setShowImageUploader(false);
                    setActiveImageIndex(null);
                  }}
                >
                  Cancel
                </button>
                <div className="text-sm text-gray-500">
                  Image will be hosted on Imgur
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {formData.images.map((image, index) => (
            <div key={`image-${index}`} className="border rounded-lg p-4">
              <div className="flex items-center gap-4 mb-3">
                <div className="font-medium">Image {index + 1}</div>
                <div className="flex-grow"></div>
                <button 
                  type="button"
                  onClick={() => openUploaderForImage(index)}
                  className="btn btn-sm btn-outline"
                  title="Upload new image"
                >
                  <span className="material-symbols-outlined">upload</span>
                </button>
                <button 
                  type="button"
                  onClick={() => removeImage(index)}
                  className="btn btn-sm btn-error btn-outline"
                  title="Remove image"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
              
              {/* Image preview */}
              {image && isValidUrl(image) ? (
                <div className="relative aspect-square w-full mb-2 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
                    className="object-contain h-full w-full"
                  />
                </div>
              ) : (
                <div className="aspect-square w-full mb-2 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-4xl text-gray-400">image</span>
                </div>
              )}
              
              <div className="form-control">
                <input 
                  type="text" 
                  value={image} 
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  className="input input-bordered text-sm" 
                  placeholder="Image URL or drag & drop an image"
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
          <button 
            type="button"
            onClick={addImage}
            className="btn btn-outline btn-sm"
          >
            <span className="material-symbols-outlined">add</span>
            Add Image
          </button>
        </div>
      </div>
      
      {/* Features */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-bold border-b pb-2">Features</h3>
        
        {formData.features.map((feature, index) => (
          <div key={`feature-${index}`} className="flex items-center gap-4">
            <div className="form-control flex-grow">
              <input 
                type="text" 
                value={feature} 
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                className="input input-bordered" 
                placeholder="Product feature"
              />
            </div>
            <button 
              type="button"
              onClick={() => removeFeature(index)}
              className="btn btn-square btn-sm btn-error"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        ))}
        
        <button 
          type="button"
          onClick={addFeature}
          className="btn btn-outline btn-sm"
        >
          <span className="material-symbols-outlined">add</span>
          Add Feature
        </button>
      </div>
      
      {/* Compatible With */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-bold border-b pb-2">Compatible With</h3>
        
        {formData.compatibility.map((item, index) => (
          <div key={`compat-${index}`} className="flex items-center gap-4">
            <div className="form-control flex-grow">
              <input 
                type="text" 
                value={item} 
                onChange={(e) => handleCompatibilityChange(index, e.target.value)}
                className="input input-bordered" 
                placeholder="Compatible device/model"
              />
            </div>
            <button 
              type="button"
              onClick={() => removeCompatibility(index)}
              className="btn btn-square btn-sm btn-error"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        ))}
        
        <button 
          type="button"
          onClick={addCompatibility}
          className="btn btn-outline btn-sm"
        >
          <span className="material-symbols-outlined">add</span>
          Add Compatible Device
        </button>
      </div>
      
      {/* Specifications */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-bold border-b pb-2">Specifications</h3>
        
        {Object.entries(formData.specifications).map(([key, value]) => (
          <div key={`spec-${key}`} className="flex items-center gap-4">
            <div className="form-control flex-grow">
              <input 
                type="text" 
                value={key} 
                onChange={(e) => handleSpecificationChange(key, e.target.value, true)}
                className="input input-bordered" 
                placeholder="Specification name"
              />
            </div>
            <div className="form-control flex-grow">
              <input 
                type="text" 
                value={value} 
                onChange={(e) => handleSpecificationChange(key, e.target.value)}
                className="input input-bordered" 
                placeholder="Specification value"
              />
            </div>
            <button 
              type="button"
              onClick={() => removeSpecification(key)}
              className="btn btn-square btn-sm btn-error"
            >
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        ))}
        
        <button 
          type="button"
          onClick={addSpecification}
          className="btn btn-outline btn-sm"
        >
          <span className="material-symbols-outlined">add</span>
          Add Specification
        </button>
      </div>
      
      {/* Inventory */}
      <div className="mt-8 space-y-4">
        <h3 className="text-lg font-bold border-b pb-2">Inventory</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text">SKU</span>
            </label>
            <input 
              type="text" 
              name="sku"
              value={formData.sku} 
              onChange={handleChange}
              className="input input-bordered" 
              placeholder="Stock Keeping Unit"
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Quantity in Stock</span>
            </label>
            <input 
              type="number" 
              name="stock"
              value={formData.stock} 
              onChange={handleChange}
              className="input input-bordered" 
              min="0"
              required
            />
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <button 
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Saving...
            </>
          ) : (
            isNew ? 'Create Product' : 'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
}