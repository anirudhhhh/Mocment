'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from './Navbar';
import { QuestionCard } from './QuestionCard';
import { User } from '../lib/types';
import { Session } from "next-auth";

// define props type
type Props = {
  session: Session;
};


export default function ClientDashboard({ session }: Props) {
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
      <main 
        className="min-h-screen bg-cover bg-center bg-no-repeat" 
        style={{ 
          backgroundImage: 'url("/dashboard-bg.avif")',
          color: 'rgb(228, 234, 107)'
        }}
      >
        
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className=" bg-opacity-40 backdrop-blur-md rounded-lg shadow-lg p-6 mb-8 border border-white border-opacity-20">
            <h1 className="text-xl font-bold">Welcome, {session.user?.name}</h1>
            <h2 className="text-2xl font-bold mb-4 text-black font-serif">Profile</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-gray-300 font-serif">Name</h3>
                <p className="text-white font-medium">{user?.name}</p>
              </div>
              <div>
                <h3 className="text-gray-300 font-serif">Country</h3>
                <p className="text-white font-medium">{user?.country}</p>
              </div>
              <div>
                <h3 className="text-gray-300 font-serif">Interests</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user?.interests?.length ? user.interests.map((interest) => (
                    <span
                      key={interest}
                      className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm border border-white border-opacity-30"
                    >
                      {interest}
                    </span>
                  )): <p> No Interests </p>}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section className=" bg-opacity-40 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white border-opacity-20"
            aria-labelledby="my-questions-heading">
              <h2 id="my-questions-heading" className="text-2xl font-bold mb-4" style={{ color: 'rgb(228, 234, 107)' }}>My Questions</h2>
              {(user?.questions ?? []).length > 0 ? (
                <div className="space-y-4">
                  {user?.questions.map((question) => (
                    <div key={question.id} className=" bg-opacity-10 backdrop-blur-sm rounded-lg p-4 border border-white border-opacity-20">
                      <QuestionCard
                        question={question}
                        onLike={handleLike}
                        onDislike={handleDislike}
                        onReply={handleReply}
                        onViewReplies={handleViewReplies}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">You haven't asked any questions yet.</p>
              )}
            </section>

            <section className="bg-opacity-40 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white border-opacity-20"
            aria-labelledby="my-replies-heading">
              <h2 id="my-replies-heading" className="text-2xl font-bold mb-4" style={{ color: 'rgb(228, 234, 107)' }}>My Replies</h2>
              {(user?.replies ?? []).length > 0 ? (
                <div className="space-y-4">
                  {user?.replies.map((reply) => (
                    <div key={reply.id} className=" bg-opacity-10 backdrop-blur-sm rounded-lg shadow-md p-6 border border-white border-opacity-20">
                      <p className="text-white mb-2">{reply.content}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-300">
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
                <p className="text-gray-300">You haven't replied to any questions yet.</p>
              )}
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

