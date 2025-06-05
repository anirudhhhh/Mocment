'use client';

import React from 'react';
import { Reply } from '../lib/types';

interface ReplyCardProps {
  reply: Reply;
  onLike: (replyId: string) => void;
  onDislike: (replyId: string) => void;
}

export const ReplyCard: React.FC<ReplyCardProps> = ({
  reply,
  onLike,
  onDislike,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-3">
      <div className="flex items-start space-x-3">
        {reply.user?.image && (
          <img
            src={reply.user.image}
            alt={reply.user.name}
            className="w-10 h-10 rounded-full"
          />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-gray-900">{reply.user?.name}</span>
            <span className="text-sm text-gray-500">
              {new Date(reply.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          {reply.contentType === 'video' && reply.videoUrl && (
            <div className="mb-3">
              <iframe
                src={reply.videoUrl}
                className="w-full aspect-video rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
          
          <p className="text-gray-800 mb-3">{reply.content}</p>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onLike(reply.id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-indigo-600"
            >
              <span>👍</span>
              <span>{reply.likes}</span>
            </button>
            <button
              onClick={() => onDislike(reply.id)}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
            >
              <span>👎</span>
              <span>{reply.dislikes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 