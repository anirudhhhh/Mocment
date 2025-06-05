'use client';

import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../../lib/types';

interface CategoryInputProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const CategoryInput: React.FC<CategoryInputProps> = ({
  selectedCategories,
  onCategoriesChange,
}) => {
  const [currentCategory, setCurrentCategory] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (currentCategory) {
      const filtered = CATEGORIES.filter((cat) =>
        cat.toLowerCase().includes(currentCategory.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [currentCategory]);

  const handleCategorySelect = (category: string) => {
    if (!selectedCategories.includes(category)) {
      onCategoriesChange([...selectedCategories, category]);
    }
    setCurrentCategory('');
    setShowSuggestions(false);
  };

  const removeCategory = (categoryToRemove: string) => {
    onCategoriesChange(selectedCategories.filter((cat) => cat !== categoryToRemove));
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={currentCategory}
        onChange={(e) => setCurrentCategory(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
        placeholder="Type # to add categories..."
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {suggestions.map((category) => (
            <div
              key={category}
              onClick={() => handleCategorySelect(category)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
            >
              {category}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {selectedCategories.map((category) => (
          <span
            key={category}
            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-2"
          >
            {category}
            <button
              type="button"
              onClick={() => removeCategory(category)}
              className="text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default CategoryInput;
