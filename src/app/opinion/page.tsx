'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';

export default function Opinion() {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement feedback submission
    console.log('Feedback submitted:', feedback);
    setFeedback('');
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Share Your Opinion
            </h1>
            <p className="text-gray-600">
              Help us improve by sharing your thoughts and suggestions
            </p>
          </header>

          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="feedback" className="block text-gray-800 font-medium mb-2">
                  Your Feedback
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  rows={6}
                  placeholder="Share your thoughts on how we can improve the platform..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </main>
    </>
  );
} 