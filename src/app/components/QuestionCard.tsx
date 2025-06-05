'use client';
import React from 'react';
import { Question } from '../../lib/types';

interface QuestionCardProps {
  question: Question;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onReply: (id: string) => void;
  onViewReplies: (id: string) => void;
}

export function QuestionCard({ question, onLike, onDislike, onReply, onViewReplies }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-2 text-sm text-gray-600">
        {question.userIdentity?.showName 
          ? `${question.userIdentity?.name} from ${question.userIdentity?.country}`
          : `A user from ${question.userIdentity?.country}`
        }
      </div>
      <p className="text-gray-800 mb-4">{question.content}</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {question.categories.map((category) => (
          <span
            key={category}
            className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
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
        {question.replies.length > 0 && (
          <button
            onClick={() => onViewReplies(question.id)}
            className="text-gray-600 hover:text-indigo-600"
          >
            View Replies ({question.replies.length})
          </button>
        )}
      </div>
    </div>
  );
} 