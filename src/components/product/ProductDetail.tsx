"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Tab } from "@headlessui/react";
import { Product } from "@/lib/data/productData";
import AddToCart from "@/components/cart/AddToCart";
import { StarIcon } from "@heroicons/react/20/solid";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ProductDetail({ product }: { product: Product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="mt-4">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="aspect-square w-full relative rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={product.images[selectedImageIndex] || ""}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          
          {/* Image thumbnails */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={classNames(
                  "aspect-square w-20 h-20 relative rounded-md overflow-hidden border-2",
                  selectedImageIndex === index ? "border-primary" : "border-transparent"
                )}
              >
                <Image
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Category: {product.category}</p>
            
            {product.rating && (
              <div className="flex items-center mt-2">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      className={classNames(
                        product.rating > rating ? "text-yellow-400" : "text-gray-300",
                        "h-5 w-5 flex-shrink-0"
                      )}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {product.rating.toFixed(1)} ({product.reviews?.length || 0} reviews)
                </span>
              </div>
            )}
          </div>
          
          <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>
          
          <div className="prose prose-sm max-w-none">
            <p>{product.description}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`badge ${product.inStock ? "badge-success" : "badge-error"}`}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </div>
            {product.inStock && <div className="text-sm text-gray-500">Usually ships within 1-2 business days</div>}
          </div>
          
          {/* Add to cart button */}
          <AddToCart product={product} />
          
          {/* Compatibility */}
          {product.compatibility && product.compatibility.length > 0 && (
            <div>
              <h3 className="text-lg font-medium">Compatible with:</h3>
              <div className="mt-2">
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {product.compatibility.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Product details tabs */}
      <div className="mt-16">
        <Tab.Group>
          <Tab.List className="flex space-x-1 border-b">
            <Tab className={({ selected }) =>
              classNames(
                'py-2.5 px-4 text-sm font-medium leading-5',
                selected
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              )
            }>
              Features
            </Tab>
            <Tab className={({ selected }) =>
              classNames(
                'py-2.5 px-4 text-sm font-medium leading-5',
                selected
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              )
            }>
              Specifications
            </Tab>
            <Tab className={({ selected }) =>
              classNames(
                'py-2.5 px-4 text-sm font-medium leading-5',
                selected
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700'
              )
            }>
              Reviews
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-4">
            <Tab.Panel className="p-4">
              <h3 className="text-lg font-medium mb-4">Key Features</h3>
              <ul className="list-disc pl-5 space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </Tab.Panel>
            <Tab.Panel className="p-4">
              <h3 className="text-lg font-medium mb-4">Technical Specifications</h3>
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="py-2 px-4 font-medium">{key}</td>
                        <td className="py-2 px-4">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab.Panel>
            <Tab.Panel className="p-4">
              <h3 className="text-lg font-medium mb-4">Customer Reviews</h3>
              
              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{review.title}</h4>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center">
                              {[0, 1, 2, 3, 4].map((rating) => (
                                <StarIcon
                                  key={rating}
                                  className={classNames(
                                    review.rating > rating ? "text-yellow-400" : "text-gray-300",
                                    "h-4 w-4 flex-shrink-0"
                                  )}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-xs text-gray-500">
                              by {review.user} on {new Date(review.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}