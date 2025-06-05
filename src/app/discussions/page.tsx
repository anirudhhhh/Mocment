'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { QuestionCard } from '../../components/QuestionCard';
import { ReplyForm } from '../../components/ReplyForm';
import { ReplyCard } from '../../components/ReplyCard';
import { QuestionForm } from '../../components/QuestionForm';
import { Question, Reply } from '../../lib/types';

// This would typically come from your authentication system
const AUTHORIZED_USER_IDS = ['user1', 'user2', 'user3'];

export default function Discussions() {
  const [discussions, setDiscussions] = useState<Question[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [viewingReplies, setViewingReplies] = useState<string | null>(null);
  const [isPostingQuestion, setIsPostingQuestion] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Simulate fetching current user - replace with your actual auth logic
  useEffect(() => {
    // This is just for demonstration. Replace with your actual auth logic
    const mockFetchCurrentUser = async () => {
      // Simulate API call
      const userId = 'user1'; // This would come from your auth system
      setCurrentUserId(userId);
    };
    mockFetchCurrentUser();
  }, []);

  const isAuthorizedToPost = currentUserId && AUTHORIZED_USER_IDS.includes(currentUserId);

  const handlePostQuestion = (content: string, categories: string[]) => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      categories,
      userId: currentUserId || '',
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: [],
      showName: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      replies: [],
      userIdentity: {
        showName: false,
        country: 'US',
        name: null,
      },
    };

    setDiscussions([newQuestion, ...discussions]);
    setIsPostingQuestion(false);
  };

  const handleLike = (questionId: string) => {
    setDiscussions(
      discussions.map((q) =>
        q.id === questionId ? { ...q, likes: q.likes + 1 } : q
      )
    );
  };

  const handleDislike = (questionId: string) => {
    setDiscussions(
      discussions.map((q) =>
        q.id === questionId ? { ...q, dislikes: q.dislikes + 1 } : q
      )
    );
  };

  const handleReply = (questionId: string) => {
    setReplyingTo(questionId);
    setViewingReplies(null);
  };

  const handleViewReplies = (questionId: string) => {
    setViewingReplies(questionId);
    setReplyingTo(null);
  };

  const handleSubmitReply = (questionId: string, content: string, contentType: 'text' | 'video', videoUrl?: string) => {
    const newReply: Reply = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      contentType,
      videoUrl,
      questionId,
      userId: currentUserId || '',
      likes: 0,
      dislikes: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        name: 'From Click',
        image: 'https://via.placeholder.com/40',
      },
    };

    setDiscussions(
      discussions.map((q) =>
        q.id === questionId
          ? { ...q, replies: [...(q.replies || []), newReply] }
          : q
      )
    );
    setReplyingTo(null);
  };

  const handleReplyLike = (questionId: string, replyId: string) => {
    setDiscussions(
      discussions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              replies: q.replies.map((r) =>
                r.id === replyId ? { ...r, likes: r.likes + 1 } : r
              ),
            }
          : q
      )
    );
  };

  const handleReplyDislike = (questionId: string, replyId: string) => {
    setDiscussions(
      discussions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              replies: q.replies.map((r) =>
                r.id === replyId ? { ...r, dislikes: r.dislikes + 1 } : r
              ),
            }
          : q
      )
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <header className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Valuable Discussions
                </h1>
                <p className="text-gray-600">
                  Explore deep conversations and meaningful insights from our community
                </p>
              </div>
              {isAuthorizedToPost && (
                <button
                  onClick={() => setIsPostingQuestion(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Post a Question
                </button>
              )}
            </div>
          </header>

          {isPostingQuestion && (
            <QuestionForm
              onSubmit={handlePostQuestion}
              onCancel={() => setIsPostingQuestion(false)}
              isAuthorized={!!isAuthorizedToPost}
            />
          )}

          <div className="space-y-4">
            {discussions.map((discussion) => (
              <div key={discussion.id}>
                <QuestionCard
                  question={discussion}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onReply={handleReply}
                  onViewReplies={handleViewReplies}
                />
                
                {replyingTo === discussion.id && (
                  <ReplyForm
                    questionId={discussion.id}
                    onSubmit={(content, contentType, videoUrl) =>
                      handleSubmitReply(discussion.id, content, contentType, videoUrl)
                    }
                    onCancel={() => setReplyingTo(null)}
                  />
                )}

                {viewingReplies === discussion.id && discussion.replies && (
                  <div className="ml-8 mt-4">
                    {discussion.replies.map((reply) => (
                      <ReplyCard
                        key={reply.id}
                        reply={reply}
                        onLike={() => handleReplyLike(discussion.id, reply.id)}
                        onDislike={() => handleReplyDislike(discussion.id, reply.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
} 