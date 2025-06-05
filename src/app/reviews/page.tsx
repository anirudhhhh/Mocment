'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';

interface VideoReview {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string;
  category: string;
  description: string;
  rating: number;
  userId: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
  views: number;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<VideoReview[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [newReview, setNewReview] = useState({
    title: '',
    videoFile: null as File | null,
    category: '',
    description: '',
    rating: 5
  });

  const categories = [
    'Fitness',
    'Nutrition',
    'Fat Loss',
    'Finance',
    'Motivational',
    'Job Interview',
    'Technology',
    'Business',
    'Education',
    'Health',
    'Mental Health',
    'Career Development',
    'Feeling stuck in life',
    'Personal Growth',
    'Productivity',
    'Time Management',
    'Leadership',
    'Communication Skills',
    'Public Speaking',
    'Stress Management',
    'Work-Life Balance',
    'Entrepreneurship'
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      setReviews(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviews([]);
    }
  };

  const handleVideoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.videoUrl;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error;
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.videoFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload video first
      const videoUrl = await handleVideoUpload(newReview.videoFile);

      // Then create the review
      const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newReview.title,
        videoUrl,
        category: newReview.category,
        description: newReview.description,
        rating: newReview.rating,
      }),
      });

      if (!response.ok) {
      throw new Error('Failed to post review');
      }

      await fetchReviews();
      setShowReviewForm(false);
      setNewReview({
      title: '',
      videoFile: null,
      category: '',
      description: '',
      rating: 5
      });
    } catch (error) {
      console.error('Error posting review:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const filteredReviews = selectedCategory === 'all' 
    ? reviews 
    : reviews.filter(review => review.category === selectedCategory);

  const topVideos = [...reviews]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Video Reviews
            </h1>
            <p className="text-gray-600">
              Confused which video to watch? Watch these video reviews to get insights and advice on various topics. You can also share your own video reviews!
            </p>
          </header>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Most Liked Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topVideos.map((video) => (
                <div key={video.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative pb-[56.25%]">
                    <video
                      src={video.videoUrl}
                      poster={video.thumbnailUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                      controls
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-1">{video.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{video.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-400">★</span>
                        <span className="text-gray-600">{video.rating}/5</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">👍 {video.likes}</span>
                        <span className="text-gray-500">👁️ {video.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 flex justify-between items-center">
            <button
              onClick={() => setShowReviewForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Share a Video Review
            </button>

            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Filter by Category
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setSelectedCategory('all');
                        setIsFilterOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm ${
                        selectedCategory === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } hover:bg-gray-100`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setIsFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          selectedCategory === category ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                        } hover:bg-gray-100`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {showReviewForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Share a Video Review</h2>
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Video Title
                    </label>
                    <input
                      type="text"
                      value={newReview.title}
                      onChange={(e) => setNewReview({...newReview, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Video
                    </label>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setNewReview({...newReview, videoFile: file});
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                      required
                    />
                    {isUploading && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={newReview.category}
                      onChange={(e) => setNewReview({...newReview, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={newReview.description}
                      onChange={(e) => setNewReview({...newReview, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating (1-5)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={newReview.rating}
                      onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isUploading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      {isUploading ? 'Uploading...' : 'Submit Review'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{review.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">Category: {review.category}</p>
                    <div className="flex items-center mb-2">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1 text-gray-600">{review.rating}/5</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500">👍 {review.likes}</span>
                    <span className="text-gray-500">👁️ {review.views}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <video
                    src={review.videoUrl}
                    poster={review.thumbnailUrl}
                    className="w-full rounded-lg"
                    controls
                  />
                </div>
                <p className="text-gray-700 mt-2">{review.description}</p>
                <div className="mt-4 flex items-center space-x-4">
                  <button className="text-gray-500 hover:text-blue-600">
                    👍 {review.likes}
                  </button>
                  <button className="text-gray-500 hover:text-red-600">
                    👎 {review.dislikes}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
} 