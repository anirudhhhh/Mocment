'use client';

import React, { useState } from 'react';

const allCategories = [
  "Reviews", "Life", "Startups", "Technology", "Career", "Sports", "Fitness",
  "Nutrition", "YouTube", "Instagram", "Facebook", "Movies", "Decisions", "Love",
  "Faith", "Family", "Marketing", "Fashion", "AI", "ML", "Insecurities", "College Life",
  "Fears", "Health Issues", "Jobs", "Design", "Video Editing", "Traveling", "Gaming",
  "Music", "Social Media", "Mental Health", "Relationships", "Education", "Finance",
  "Business", "Money", "Politics"
];

interface Props {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const CategoryInput: React.FC<Props> = ({ selectedCategories, onCategoriesChange }) => {
  const [query, setQuery] = useState('');

  const filteredCategories = query === ''
    ? []
    : allCategories.filter(
        (cat) =>
          cat.toLowerCase().includes(query.toLowerCase()) &&
          !selectedCategories.includes(cat)
      );

  const addCategory = (cat: string) => {
    if (!selectedCategories.includes(cat)) {
      onCategoriesChange([...selectedCategories, cat]);
      setQuery('');
    }
  };

  const removeCategory = (cat: string) => {
    onCategoriesChange(selectedCategories.filter((c) => c !== cat));
  };

return (
  <div>
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Start typing to search categories..."
      className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    />

    {/* Dropdown Options */}
    {filteredCategories.length > 0 && (
      <ul className="border border-gray-300 rounded-md mt-2 max-h-48 overflow-y-auto bg-white shadow z-10 relative text-gray-900">
        {filteredCategories.map((cat) => (
          <li
            key={cat}
            onClick={() => addCategory(cat)}
            className="cursor-pointer px-4 py-2 hover:bg-indigo-100 hover:text-indigo-700 text-gray-800"
          >
            {cat}
          </li>
        ))}
      </ul>
    )}

    {/* Selected Category Tags */}
    <div className="flex flex-wrap mt-3 gap-2">
      {selectedCategories.map((cat) => (
        <span
          key={cat}
          className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
        >
          {cat}
          <button
            onClick={() => removeCategory(cat)}
            className="text-indigo-500 hover:text-red-500"
            type="button"
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
