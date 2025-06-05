'use client';

import React, { useState, useEffect } from 'react';
import { HomeQuestionForm } from '../components/HomeQuestionForm';
import { QuestionCard } from '../components/QuestionCard';
import { Navbar } from '../components/Navbar';
import { Question } from '../lib/types';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id || '';
  const [questions, setQuestions] = useState<Question[]>([]);
  const [starQuestion, setStarQuestion] = useState<Question | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<{ content: string; categories: string[] } | null>(null);
  const [showName, setShowName] = useState<boolean>(false);
  const [country, setCountry] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch questions
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch('/api/questions');
        const data = await res.json();
        // Sort replies by likes when initially loading questions
        const sortedData = data.map((question: Question) => ({
          ...question,
          replies: [...question.replies].sort((a, b) => b.likes - a.likes)
        }));
        setQuestions(sortedData);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
    fetchQuestions();
  }, []);

  const handleQuestionSubmit = async (content: string, categories: string[]) => {
    // Check if user is signed in
    const sessionRes = await fetch('/api/auth/session');
    const session = await sessionRes.json();

    if (!session?.user) {
      // Redirect to sign in if not authenticated
      window.location.href = '/api/auth/signin';
      return;
    }

    setPendingQuestion({ content, categories });
    setShowIdentityModal(true);
    setShowName(false);
    setCountry('');
  };

  const handleIdentitySubmit = async () => {
    if (!pendingQuestion) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: pendingQuestion.content,
          categories: pendingQuestion.categories,
          showName,
          country,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post question');
      }

      const newQuestion = await response.json();
      setQuestions([newQuestion, ...questions]);
      setShowIdentityModal(false);
      setPendingQuestion(null);
      setShowName(false);
      setCountry('');

      // Refresh the questions list to ensure we have the latest data
      const res = await fetch('/api/questions');
      const data = await res.json();
      setQuestions(data);

      // Dispatch custom event to notify dashboard
      window.dispatchEvent(new Event('newQuestionPosted'));
    } catch (error) {
      console.error('Error posting question:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function fetchStarQuestion() {
      const res = await fetch("/api/star-question");
      const data = await res.json();
      setStarQuestion(data);
    }
    fetchStarQuestion();
  }, []);

  const handleLike = (questionId: string, userId: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => {
        if (q.id !== questionId) return q;

        const alreadyLiked = q.likedBy.includes(userId);
        const alreadyDisliked = q.dislikedBy.includes(userId);

        return {
          ...q,
          likes: alreadyLiked ? q.likes - 1 : q.likes + 1,
          dislikes: alreadyDisliked ? q.dislikes - 1 : q.dislikes,
          likedBy: alreadyLiked
            ? q.likedBy.filter((id) => id !== userId)
            : [...q.likedBy, userId],
          dislikedBy: alreadyDisliked
            ? q.dislikedBy.filter((id) => id !== userId)
            : q.dislikedBy,
        };
      })
    );
  };

  const handleDislike = (questionId: string, userId: string) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) => {
        if (q.id !== questionId) return q;

        const alreadyDisliked = q.dislikedBy.includes(userId);
        const alreadyLiked = q.likedBy.includes(userId);

        return {
          ...q,
          dislikes: alreadyDisliked ? q.dislikes - 1 : q.dislikes + 1,
          likes: alreadyLiked ? q.likes - 1 : q.likes,
          dislikedBy: alreadyDisliked
            ? q.dislikedBy.filter((id) => id !== userId)
            : [...q.dislikedBy, userId],
          likedBy: alreadyLiked
            ? q.likedBy.filter((id) => id !== userId)
            : q.likedBy,
        };
      })
    );
  };


  const handleReply = (questionId: string) => {
    setReplyingTo(questionId);
    setReplyContent('');
  };

  const handlePostReply = async (questionId: string) => {
    if (!replyContent.trim()) return;

    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    // Fetch the session to get the current user ID
    let currentUserId: string | undefined = undefined;
    try {
      const sessionRes = await fetch('/api/auth/session');
      const session = await sessionRes.json();
      currentUserId = session?.user?.id;
    } catch (error) {
      console.error('Error fetching session:', error);
    }

    // Ensure currentUserId is defined and a string
    if (!currentUserId) {
      alert("You must be signed in to reply.");
      return;
    }

    // Check if the user is the author of the question
    if (question.userId === currentUserId) {
      alert("You cannot reply to your own question.");
      return;
    }

    const newReply = {
      id: Date.now().toString(),
      content: replyContent,
      contentType: 'text' as const,
      userId: currentUserId,
      questionId: questionId,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      dislikes: 0
    };

    // Update questions with new reply and sort replies
    const updatedQuestions = questions.map(q =>
      q.id === questionId
        ? {
          ...q,
          replies: [...q.replies, newReply].sort((a, b) => b.likes - a.likes)
        }
        : q
    );
    setQuestions(updatedQuestions);

    setReplyingTo(null);
    setReplyContent('');
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setReplyContent('');
  };

  const handleViewReplies = (questionId: string) => {
    // Sort replies when viewing them
    setQuestions(
      questions.map(q =>
        q.id === questionId
          ? { ...q, replies: [...q.replies].sort((a, b) => b.likes - a.likes) }
          : q
      )
    );
  };

  const filteredQuestions = selectedCategory === 'all'
    ? questions
    : questions.filter(q => q.categories.includes(selectedCategory));

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Question & Advice Platform
            </h1>
            <p className="text-gray-600">
              Ask questions, get advice, and help others in their journey
            </p>
          </header>

          <HomeQuestionForm
            onSubmit={handleQuestionSubmit}
            onCancel={() => setPendingQuestion(null)}
          />

          {showIdentityModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full text-gray-800">
                <h2 className="text-xl font-bold mb-4">How would you like to be identified?</h2>

                <div className="mb-4">
                  <label className="flex items-center space-x-2 text-gray-800">
                    <input
                      type="checkbox"
                      checked={showName}
                      onChange={(e) => setShowName(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Show my name</span>
                  </label>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-800 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Enter your country"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-500"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setShowIdentityModal(false);
                      setPendingQuestion(null);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleIdentitySubmit}
                    disabled={isLoading || !country}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Posting...' : 'Post Question'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {starQuestion && (
            <>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Star Question of the Week
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                {starQuestion && (
                    <QuestionCard
                    question={starQuestion}
                    onLike={(questionId) => handleLike(questionId, currentUserId)}
                    onDislike={(questionId) => handleDislike(questionId, currentUserId)}
                    onReply={handleReply}
                    onViewReplies={handleViewReplies}
                  />
                )}
              </div>
            </>
          )}

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Recent Questions</h2>
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Filter by Category
                </button>
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1 max-h-[300px] overflow-y-auto" role="menu">
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setIsFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${selectedCategory === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                          } hover:bg-gray-100 sticky top-0 bg-white z-10`}
                        role="menuitem"
                      >
                        All Categories
                      </button>
                      {['Reviews', 'Life', 'Startups', 'Technology', 'Career', 'Sports', 'Fitness', 'Nutrition', 'YouTube', 'Instagram', 'Facebook', 'Movies', 'Decisions', 'Love', 'Faith', 'Family', 'Marketing', 'Fashion', 'AI', 'ML', 'Insecurities', 'College Life', 'Fears', 'Health Issues', 'Jobs', 'Design', 'Video Editing', 'Traveling', 'Gaming', 'Music', 'Social Media', 'Mental Health', 'Relationships', 'Education', 'Finance', 'Business', 'Money', 'Politics'].map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setIsFilterOpen(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${selectedCategory === category ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                            } hover:bg-gray-100`}
                          role="menuitem"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {filteredQuestions.map((question) => (
                <div key={question.id}>
                  <QuestionCard
                  question={question}
                  onLike={(questionId) => handleLike(questionId, currentUserId)}
                  onDislike={(questionId) => handleDislike(questionId, currentUserId)}
                  onReply={handleReply}
                  onViewReplies={handleViewReplies}
                />
                  {replyingTo === question.id && (
                    <div className="mt-2 ml-8 p-4 bg-white rounded-lg border border-gray-200">
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write your reply..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                        rows={3}
                      />
                      <div className="mt-2 flex justify-end space-x-2">
                        <button
                          onClick={handleCancelReply}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handlePostReply(question.id)}
                          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                        >
                          Post Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
