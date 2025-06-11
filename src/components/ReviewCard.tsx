'use client';

import React, { useState } from 'react';

interface ReviewCardProps {
  review: {
    id: string;
    title: string;
    category: string;
    description: string;
    rating: number;
    views: number;
    agreements: number;
    videoUrl?: string | null;
    imageUrl?: string | null;
  };
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [agreements, setAgreements] = useState(review.agreements || 0);
  const [agreed, setAgreed] = useState(false);

  const handleAgree = async () => {
    if (agreed) return;

    const res = await fetch('/api/reviews/agreement', {
      method: 'POST',
      body: JSON.stringify({ reviewId: review.id }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (data.success) {
      setAgreed(true);
      setAgreements(data.agreements);
    }
  };

  return (
    <div className="bg-[#fdebd0] rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between gap-6">
      {/* Text Section */}
      <div className="md:w-1/2 w-full">
        <h3 className="text-[2.5rem] font-serif font-medium text-[#3b3429] leading-tight">
          {review.title}
        </h3>
        <p className="text-sm text-[#6c6326] mb-1">
          Category: <span className="font-medium">{review.category}</span>
        </p>
        <div className="flex items-center mb-2">
          <span className="text-yellow-400">★</span>
          <span className="ml-1 text-gray-700">{review.rating}/5</span>
        </div>
        <p className="text-[#6c6326] mb-4">{review.description}</p>
        <div className="flex items-center space-x-6 mt-4">
          <button
            onClick={handleAgree}
            disabled={agreed}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              agreed
                ? 'bg-green-600 text-white cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-green-600 hover:text-white'
            }`}
          >
            I Agree
          </button>
          <span className="text-gray-700 text-sm">{agreements} agreed</span>
          <span className="text-gray-500 text-sm">{review.views} views</span>
        </div>
      </div>

      {/* Media Section */}
      <div className="md:w-1/2 w-full flex justify-center items-center">
        {review.videoUrl ? (
          <video
            src={review.videoUrl}
            poster="/video-thumbnail.jpg"
            controls
            className="rounded-lg max-w-full h-auto"
          />
        ) : review.imageUrl ? (
          <img
            src={review.imageUrl}
            alt={review.title}
            className="rounded-lg max-w-full h-auto"
          />
        ) : (
          <div className="text-gray-400 italic">No media attached</div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
