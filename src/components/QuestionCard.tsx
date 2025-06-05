'use client';

import React from 'react';
import { Question } from '../lib/types';

interface QuestionCardProps {
  question: Question;
  onLike: (questionId: string) => void;
  onDislike: (questionId: string) => void;
  onReply: (questionId: string) => void;
  onViewReplies: (questionId: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  onLike,
  onDislike,
  onReply,
  onViewReplies,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 text-sm text-gray-600">
            From Click
          </div>
          <p className="text-gray-800 text-lg mb-2">{question.content}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {question.categories?.map((category) => (
              <span
                key={category}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(question.id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
            >
              <span>👍</span>
              <span>{question.likes}</span>
            </button>
            <button
              onClick={() => onDislike(question.id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
            >
              <span>👎</span>
              <span>{question.dislikes}</span>
            </button>
            <button
              onClick={() => onReply(question.id)}
              className="text-gray-600 hover:text-indigo-600"
            >
              Reply
            </button>
            {question.replies?.length > 0 && (
              <button
                onClick={() => onViewReplies(question.id)}
                className="text-gray-600 hover:text-indigo-600"
              >
                View Replies ({question.replies.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 