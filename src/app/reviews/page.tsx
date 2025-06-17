'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '../../components/Navbar';
import ReviewCard from '../../components/ReviewCard';
import {toast} from 'react-hot-toast';

interface VideoReview {
  id: string;
  title: string;
  videoUrl?: string;
  imageUrl?: string;
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
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [mediaType, setMediaType] = useState<'upload' | 'capture'>('upload');
  const [showCamera, setShowCamera] = useState(false);
  const [cameraMode, setCameraMode] = useState<'photo' | 'video'>('photo');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [newReview, setNewReview] = useState({
    title: '',
    videoFile: null as File | null,
    imageFile: null as File | null,
    category: '',
    description: '',
    rating: 5
  });



  const categories = [
    'Cafes',
    'Restaurants',
    'Hotels',
    'Courses',
    'Books',
    'Movies',
    'Online Products',
    'Gyms',
    'Clothing',
    'Travel',
    'Fitness',
    'Nutrition',
    'Fat Loss',
    'You tube',
    'Social Media',
    'Finance',
    'Job Interview',
    'Technology',
    'Business',
    'Education',
    'Health',
    'Mental Health',
    'Career Development'
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

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

// Updated upload functions for your React component

const handleImageUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file); // Matches the API route

  try {
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    if (!data.imageUrl) {
      throw new Error('No image URL returned from server');
    }

    return data.imageUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

const handleVideoUpload = async (file: File) => {
  const formData = new FormData();
  formData.append('video', file); // Keep this as 'video' for video uploads

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed');
    }

    if (!data.videoUrl) {
      throw new Error('No video URL returned from server');
    }

    return data.videoUrl;
  } catch (error) {
    console.error('Error uploading video:', error);
    throw error;
  }
};

// Updated submit function with better error handling
const handleSubmitReview = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!newReview.title.trim() || !newReview.category || !newReview.description.trim()) {
    toast.error('Please fill in all required fields');
    return;
  }

  setIsUploading(true);
  setUploadProgress(0);

  try {
    let videoUrl = undefined;
    let imageUrl = undefined;

    // Upload video if provided
    if (newReview.videoFile) {
      setUploadProgress(25);
      videoUrl = await handleVideoUpload(newReview.videoFile);
      setUploadProgress(50);
    }

    // Upload image if provided
    if (newReview.imageFile) {
      setUploadProgress(newReview.videoFile ? 75 : 50);
      imageUrl = await handleImageUpload(newReview.imageFile);
    }

    setUploadProgress(90);

    // Create the review
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newReview.title,
        videoUrl,
        imageUrl,
        category: newReview.category,
        description: newReview.description,
        rating: newReview.rating,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to post review');
    }

    setUploadProgress(100);
    await fetchReviews();
    setShowReviewForm(false);
    setNewReview({
      title: '',
      videoFile: null,
      imageFile: null,
      category: '',
      description: '',
      rating: 5
    });

    toast.success('Review posted successfully!');
  } catch (error) {
    console.error('Error posting review:', error);
    toast.error(`Failed to upload content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    setIsUploading(false);
    setUploadProgress(0);
  }
};


  const filteredReviews = selectedCategory === 'all'
    ? [...reviews].sort((a, b) => ((b.likes ?? 0) - (b.dislikes ?? 0)) - ((a.likes ?? 0) - (a.dislikes ?? 0)))
    : reviews
        .filter(review => review.category === selectedCategory)
        .sort((a, b) => ((b.likes ?? 0) - (b.dislikes ?? 0)) - ((a.likes ?? 0) - (a.dislikes ?? 0)));

  const startCamera = async (mode: 'photo' | 'video') => {
    try {
      if(typeof window !== 'undefined' || navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: mode === 'video'
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setShowCamera(true);
        setCameraMode(mode);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please check your permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
            setNewReview({ ...newReview, imageFile: file, videoFile: null });
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const startRecording = async () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const file = new File([blob], 'recorded-video.webm', { type: 'video/webm' });
        setNewReview({ ...newReview, videoFile: file, imageFile: null });
        stopCamera();
      };

      mediaRecorder.start();
      setTimeout(() => mediaRecorder.stop(), 1000000); // 1000 second recording limit
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <section
            className="relative w-full h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center text-white text-center"
            style={{ backgroundImage: "url('/review-bg.avif')",
              backgroundSize: 'cover',
               backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
             }}
          >
            {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> Overlay */}
            <div className="relative z-10 px-4">
              <h1 className="text-6xl md:text-8xl font-serif font-bold mb-4 tracking-wide">
                Reviews
              </h1>

              <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-8">
                Share your experience ,we would love to know. Also get the best reviews on all categories you need.
              </p>

              <button
                onClick={() => setShowReviewForm(true)}
                className="px-6 py-3 bg-white text-gray-800 font-semibold rounded-full shadow hover:bg-gray-100 transition"
              >
                Post a Review
              </button>
            </div>
          </section>

          <div className="mb-8 flex justify-between items-center">


            <div className="relative">
              <div className="relative inline-block text-left" ref={dropdownRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="px-4 py-2 bg-[#765e39] border mt-6 border-gray-300 shadow-sm text-sm font-medium text-white hover:bg-[#3b3429] rounded-full"
                >
                  Filter by Category
                </button>

                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1 max-h-60 overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setIsFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${selectedCategory === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } hover:bg-gray-100`}
                      >
                        All Categories
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsFilterOpen(false); // closes dropdown on selection
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${selectedCategory === category ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
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
          </div>

          {showReviewForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-4 my-8">
      <h2 className="text-3xl font-serif text-[#3b3429] font-semibold mb-6 text-center">
        Share a Review
      </h2>
      <form onSubmit={handleSubmitReview} className="space-y-6">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Review Title</label>
          <input
            type="text"
            value={newReview.title}
            onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </div>

        {/* Media Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Add Media Content</label>
          <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Choose Media Type
  </label>
  <div className="flex items-center space-x-6">
    <label className="inline-flex items-center">
      <input
        type="radio"
        name="mediaType"
        value="upload"
        checked={mediaType === 'upload'}
        onChange={() => setMediaType('upload')}
        className="text-indigo-600 focus:ring-indigo-500 border-gray-300"
      />
      <span className="ml-2 text-gray-700">Upload from Device</span>
    </label>
    <label className="inline-flex items-center">
      <input
        type="radio"
        name="mediaType"
        value="capture"
        checked={mediaType === 'capture'}
        onChange={() => setMediaType('capture')}
        className="text-indigo-600 focus:ring-indigo-500 border-gray-300"
      />
      <span className="ml-2 text-gray-700">Capture Media</span>
    </label>
  </div>
</div>


          {mediaType === 'upload' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Upload Video</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewReview({ ...newReview, videoFile: file, imageFile: null });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNewReview({ ...newReview, imageFile: file, videoFile: null });
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {!showCamera ? (
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => startCamera('photo')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Take Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => startCamera('video')}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Record Video
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-center space-x-4">
                    {cameraMode === 'photo' ? (
                      <button
                        type="button"
                        onClick={capturePhoto}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                      >
                        Capture Photo
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startRecording}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Start Recording
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={stopCamera}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {isUploading && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">Uploading... {uploadProgress}%</p>
            </div>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={newReview.category}
            onChange={(e) => setNewReview({ ...newReview, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 shadow-sm"
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

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={newReview.description}
            onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 shadow-sm"
            rows={4}
            required
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1–5)</label>
          <input
            type="number"
            min="1"
            max="5"
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-2">
          <button
            type="button"
            onClick={() => setShowReviewForm(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUploading}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
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
    <ReviewCard
      key={review.id}
      review={{
        id: review.id,
        title: review.title,
        category: review.category,
        description: review.description,
        rating: review.rating,
        views: review.views,
        agreements: (review.likes ?? 0) - (review.dislikes ?? 0),
        videoUrl: review.videoUrl ?? null,
        imageUrl: review.imageUrl ?? null,
      }}
    />
  ))}
</div>
        </div>
      </main>
    </>
  );
} 