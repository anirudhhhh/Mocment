'use client';

import React, { useState } from 'react';

interface ReplyFormProps {
  questionId: string;
  onSubmit: (content: string, contentType: 'text' | 'video', videoUrl?: string, questionId?:string) => void;
  onCancel: () => void;
}

export const ReplyForm: React.FC<ReplyFormProps> = ({
  questionId,
  onSubmit,
  onCancel,
}) => {
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState<'text' | 'video'>('text');
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(content, contentType, contentType === 'video' ? videoUrl : undefined, questionId);
    setContent('');
    setVideoUrl('');
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="flex space-x-4">
        <button
          type="button"
          onClick={() => setContentType('text')}
          className={`px-4 py-2 rounded ${
            contentType === 'text'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Text Reply
        </button>
        <button
          type="button"
          onClick={() => setContentType('video')}
          className={`px-4 py-2 rounded ${
            contentType === 'video'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Video Reply
        </button>
      </div>

      {contentType === 'text' ? (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your reply..."
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500 bg-white"
          rows={4}
          required
        />
      ) : (
        <div className="space-y-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a description for your video..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500 bg-white"
            rows={2}
            required
          />
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="Paste your video URL here..."
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500 bg-white"
            required
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700"
        >
          Submit Reply
        </button>
      </div>
    </form>
  );
}; 