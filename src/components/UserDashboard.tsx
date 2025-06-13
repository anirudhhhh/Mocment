import React from 'react';
import { User } from '../lib/types';
import { QuestionCard } from './QuestionCard';

interface UserDashboardProps {
  user: User;
  onLike: (questionId: string) => void;
  onDislike: (questionId: string) => void;
  onReply: (questionId: string) => void;
  onViewReplies: (questionId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  onLike,
  onDislike,
  onReply,
  onViewReplies,
}) => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-gray-600">Name</h3>
            <p className="text-gray-800 font-medium">{user.name}</p>
          </div>
          <div>
            <h3 className="text-gray-600">Country</h3>
            <p className="text-gray-800 font-medium">{user.country}</p>
          </div>
          <div>
            <h3 className="text-gray-600">Interests</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Questions</h2>
          {user.questions.length > 0 ? (
            user.questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onLike={onLike}
                onDislike={onDislike}
                onReply={onReply}
                onViewReplies={onViewReplies}
              />
            ))
          ) : (
            <p className="text-gray-600">You haven't asked any questions yet.</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">My Replies</h2>
          {user.replies.length > 0 ? (
            <div className="space-y-4">
              {user.replies.map((reply) => (
                <div key={reply.id} className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-800 mb-2">{reply.content}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Likes: {reply.likes}</span>
                    <span>•</span>
                    <span>
                      Posted on:{' '}
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">You haven't replied to any questions yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}; 