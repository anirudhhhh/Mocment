'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { QuestionCard } from './QuestionCard';
import { User, Question } from '../lib/types';
import { Session } from 'next-auth';

interface ClientDashboardProps {
  session: Session;
}

const ClientDashboard = ({ session }: ClientDashboardProps) => {
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = async () => {
    const res = await fetch('/api/get-user-dashboard');
    if (res.ok) {
      const data = await res.json();
      setUser(data);
    } else {
      console.error('Failed to load user');
    }
  };

  useEffect(() => {
    fetchUser();
    
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(fetchUser, 30000);
    return () => clearInterval(interval);
  }, []);

  // Listen for custom event when a new question is posted
  useEffect(() => {
    const handleNewQuestion = () => {
      fetchUser();
    };

    window.addEventListener('newQuestionPosted', handleNewQuestion);
    return () => {
      window.removeEventListener('newQuestionPosted', handleNewQuestion);
    };
  }, []);

  const handleLike = (questionId: string) => {
    if (user) {
      setUser({
        ...user,
        questions: user.questions.map((q) =>
          q.id === questionId ? { ...q, likes: q.likes + 1 } : q
        ),
      });
    }
  };

  const handleDislike = (questionId: string) => {
    if (user) {
      setUser({
        ...user,
        questions: user.questions.map((q) =>
          q.id === questionId ? { ...q, dislikes: q.dislikes + 1 } : q
        ),
      });
    }
  };

  const handleReply = (questionId: string) => {
    console.log('Reply to question:', questionId);
  };

  const handleViewReplies = (questionId: string) => {
    console.log('View replies for question:', questionId);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Dashboard</h1>
          </header>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-600">Name</h3>
                <p className="text-gray-800 font-medium">{user?.name}</p>
              </div>
              <div>
                <h3 className="text-gray-600">Country</h3>
                <p className="text-gray-800 font-medium">{user?.country}</p>
              </div>
              <div>
                <h3 className="text-gray-600">Interests</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user?.interests.map((interest) => (
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
              {(user?.questions ?? []).length > 0 ? (
                user?.questions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onReply={handleReply}
                    onViewReplies={handleViewReplies}
                  />
                ))
              ) : (
                <p className="text-gray-600">You haven't asked any questions yet.</p>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">My Replies</h2>
              {(user?.replies ?? []).length > 0 ? (
                <div className="space-y-4">
                  {user?.replies.map((reply) => (
                    <div key={reply.id} className="bg-white rounded-lg shadow-md p-6">
                      <p className="text-gray-800 mb-2">{reply.content}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>Likes: {reply.likes}</span>
                        <span>•</span>
                        <span>
                          Posted on: {new Date(reply.createdAt).toLocaleDateString()}
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
      </main>
    </>
  );
};

export default ClientDashboard;
