"use client";

import { useState } from "react";
import { Category } from "@/types";

interface CategoryFilterProps {
  categories: Category[];
  onSelectCategory: (categoryId: string | null) => void;
}

export default function CategoryFilter({ categories, onSelectCategory }: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string | null) => {
    setActiveCategory(categoryId);
    onSelectCategory(categoryId);
  };

  return (
    <div className="flex flex-wrap gap-2 my-4">
      <button 
        onClick={() => handleCategoryClick(null)} 
        className={`btn ${activeCategory === null ? 'btn-primary' : 'btn-outline'}`}
      >
        All
      </button>
      {categories.map(category => (
        <button 
          key={category.id}
          onClick={() => handleCategoryClick(category.id)} 
          className={`btn ${activeCategory === category.id ? 'btn-primary' : 'btn-outline'}`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}