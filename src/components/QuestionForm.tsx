'use client';
import React, { useState } from 'react';
import CategoryInput from '../app/components/Category';

interface QuestionFormProps {
  onSubmit: (content: string, categories: string[]) => void;
  onCancel?: () => void; // make it optional
}

export function QuestionForm({ onSubmit , onCancel }: QuestionFormProps) {
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && categories.length > 0) {
      onSubmit(content.trim(), categories);
      setContent('');
      setCategories([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
          Your Question
        </label>
        <textarea
          id="question"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What would you like to ask?"
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 textcolor-gray-900 placeholder-gray-500"
          rows={4}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Categories
        </label>
        <CategoryInput
          selectedCategories={categories}
          onCategoriesChange={setCategories}
        />
      </div>

<div className="flex justify-end gap-2">
  {onCancel && (
    <button
      type="button"
      onClick={onCancel}
      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
    >
      Cancel
    </button>
  )}
  <button
    type="submit"
    disabled={!content.trim() || categories.length === 0}
    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
  >
    Ask Question
  </button>
</div>

    </form>
  );
}
