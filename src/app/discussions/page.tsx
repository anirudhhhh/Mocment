'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { QuestionCard } from '../../components/QuestionCard';
import { ReplyForm } from '../../components/ReplyForm';
import { ReplyCard } from '../../components/ReplyCard';
import { QuestionForm } from '../../components/QuestionForm';
import { Question, Reply } from '../../lib/types';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const Discussions: React.FC = () => {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id || '';
  const [discussions, setDiscussions] = useState<Question[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [viewingReplies, setViewingReplies] = useState<string | null>(null);
  const [isPostingQuestion, setIsPostingQuestion] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showIdentityModal, setShowIdentityModal] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<{ content: string; categories: string[] } | null>(null);
  const [showName, setShowName] = useState<boolean>(false);
  const [country, setCountry] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const res = await fetch('/api/questions');
        const data = await res.json();
        const sortedData = data.map((question: Question) => ({
          ...question,
          replies: [...question.replies].sort((a, b) => b.likes - a.likes)
        }));
        setDiscussions(sortedData);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
    fetchQuestions();
  }, []);


  const handlePostQuestion = async (content: string, categories: string[]) => {
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
      setDiscussions([newQuestion, ...discussions]);
      setShowIdentityModal(false);
      setPendingQuestion(null);
      setShowName(false);
      setCountry('');

      // Refresh the questions list
      const res = await fetch('/api/questions');
      const data = await res.json();
      setDiscussions(data);

      // Dispatch custom event to notify dashboard
      window.dispatchEvent(new Event('newQuestionPosted'));
    } catch (error) {
      console.error('Error posting question:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (questionId: string) => {
    try {
      const response = await fetch(`/api/questions/${questionId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to like question');
      }

      setDiscussions(
        discussions.map((q: Question) => {
          if (q.id !== questionId) return q;

          const alreadyLiked = q.likedBy.includes(currentUserId);
          const alreadyDisliked = q.dislikedBy.includes(currentUserId);

          return {
            ...q,
            likes: alreadyLiked ? q.likes - 1 : q.likes + 1,
            dislikes: alreadyDisliked ? q.dislikes - 1 : q.dislikes,
            likedBy: alreadyLiked
              ? q.likedBy.filter((id: string) => id !== currentUserId)
              : [...q.likedBy, currentUserId],
            dislikedBy: alreadyDisliked
              ? q.dislikedBy.filter((id: string) => id !== currentUserId)
              : q.dislikedBy,
          };
        })
      );
    } catch (error) {
      console.error('Error liking question:', error);
    }
  };

  const handleDislike = async (questionId: string) => {
    try {
      const response = await fetch(`/api/questions/${questionId}/dislike`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to dislike question');
      }

      setDiscussions(
        discussions.map((q: Question) => {
          if (q.id !== questionId) return q;

          const alreadyDisliked = q.dislikedBy.includes(currentUserId);
          const alreadyLiked = q.likedBy.includes(currentUserId);

          return {
            ...q,
            dislikes: alreadyDisliked ? q.dislikes - 1 : q.dislikes + 1,
            likes: alreadyLiked ? q.likes - 1 : q.likes,
            dislikedBy: alreadyDisliked
              ? q.dislikedBy.filter((id: string) => id !== currentUserId)
              : [...q.dislikedBy, currentUserId],
            likedBy: alreadyLiked
              ? q.likedBy.filter((id: string) => id !== currentUserId)
              : q.likedBy,
          };
        })
      );
    } catch (error) {
      console.error('Error disliking question:', error);
    }
  };

  const handleReply = (questionId: string) => {
    setReplyingTo(questionId);
    setViewingReplies(null);
  };

  const handleViewReplies = (questionId: string) => {
    setViewingReplies(questionId);
    setReplyingTo(null);
  };

  const handleSubmitReply = async (questionId: string, content: string, contentType: 'text' | 'video', videoUrl?: string) => {
    try {
      const response = await fetch('/api/replies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          contentType,
          videoUrl,
          questionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to post reply');
      }

      const newReply = await response.json();
      
      setDiscussions(
        discussions.map((q) =>
          q.id === questionId
            ? { ...q, replies: [...(q.replies || []), newReply] }
            : q
        )
      );
      setReplyingTo(null);
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const handleReplyLike = async (questionId: string, replyId: string) => {
    try {
      const response = await fetch(`/api/replies/${replyId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to like reply');
      }

      setDiscussions(
        discussions.map((q: Question) =>
          q.id === questionId
            ? {
                ...q,
                replies: q.replies.map((r: Reply) =>
                  r.id === replyId ? { ...r, likes: r.likes + 1 } : r
                ),
              }
            : q
        )
      );
    } catch (error) {
      console.error('Error liking reply:', error);
    }
  };

  const handleReplyDislike = async (questionId: string, replyId: string) => {
    try {
      const response = await fetch(`/api/replies/${replyId}/dislike`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to dislike reply');
      }

      setDiscussions(
        discussions.map((q: Question) =>
          q.id === questionId
            ? {
                ...q,
                replies: q.replies.map((r: Reply) =>
                  r.id === replyId ? { ...r, dislikes: r.dislikes + 1 } : r
                ),
              }
            : q
        )
      );
    } catch (error) {
      console.error('Error disliking reply:', error);
    }
  };

  const filteredDiscussions = selectedCategory === 'all'
    ? discussions
    : discussions.filter((q: Question) => q.categories.includes(selectedCategory));

return (
  <>
    <Navbar />
    {/* Background Image Container - Applied to entire page */}
    <div 
      className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-30 -z-10"
      style={{ backgroundImage: "url('/anything.png')" }}
    ></div>
    
    <main className="min-h-screen relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section with Gradient Overlay */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-200 via-pink-200 to-orange-300">
          {/* Remove the background image div from here since it's now global */}
          
          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-green-400 opacity-30 animate-pulse"></div>
          <div className="absolute bottom-32 left-16 w-4 h-4 bg-white rounded-full opacity-60"></div>
          <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-yellow-400 rounded-full opacity-40"></div>
          <div className="absolute bottom-1/4 right-1/3 w-8 h-8 bg-blue-400 rounded-full opacity-30"></div>
          
          {/* Main Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-8 flex flex-col lg:flex-row items-center justify-between gap-12">
            
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Join the
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Discussion
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-700 mb-8 max-w-2xl leading-relaxed">
                Share your thoughts, ask questions, and connect with a community that cares about your growth.
              </p>
              
              <button
                onClick={() => setIsPostingQuestion(true)}
                className="group relative px-8 py-4 bg-gray-900 text-white text-lg font-semibold rounded-full hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10">Post Your Question</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              
              {/* Stats or Features */}
              <div className="mt-12 flex flex-wrap gap-8 justify-center lg:justify-start">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">1000+</div>
                  <div className="text-gray-600">Active Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">50+</div>
                  <div className="text-gray-600">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
              </div>
            </div>
            
            {/* Right Content - Enhanced Image */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative">
                {/* Main Image Container */}
                <div className="relative bg-white p-6 rounded-3xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Image 
                    src="/anything.png" 
                    alt="Discussion Community" 
                    className="w-80 h-80 object-cover rounded-2xl"
                  />
                  
                  {/* Floating Elements */}
                  <div className="absolute -top-4 -right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  
                  <div className="absolute -bottom-4 -left-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl opacity-20 -z-10"></div>
              </div>
            </div>
          </div>
          
          {/* Bottom Wave */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg className="w-full h-24 fill-white fill-opacity-80" viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
            </svg>
          </div>
        </section>

        {/* Content Section - Removed bg-white bg-opacity-70 backdrop-blur-md to allow background to show through */}
        <div className="px-8 py-12">
          {/* Rest of your content remains the same */}
          {isPostingQuestion && (
            <QuestionForm
              onSubmit={handlePostQuestion}
              onCancel={() => setIsPostingQuestion(false)}
            />
          )}

          {showIdentityModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl p-6 max-w-md w-full text-gray-800 shadow-2xl">
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
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleIdentitySubmit}
                    disabled={isLoading || !country}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Posting...' : 'Post Question'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800 drop-shadow-sm">Recent Questions</h2>
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="px-4 py-2 bg-white bg-opacity-90 backdrop-blur-sm border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:bg-opacity-95 hover:shadow-md transition-all"
                >
                  Filter by Category
                </button>
                {isFilterOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white bg-opacity-95 backdrop-blur-sm ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1 max-h-[300px] overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedCategory('all');
                          setIsFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-sm ${
                          selectedCategory === 'all' ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
                        } hover:bg-gray-100 sticky top-0 bg-white bg-opacity-95 z-10`}
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
                          className={`block w-full text-left px-4 py-2 text-sm ${
                            selectedCategory === category ? 'bg-blue-50 text-blue-900' : 'text-gray-700'
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

            <div className="space-y-6">
              {filteredDiscussions.map((discussion) => (
                <div key={discussion.id} className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-sm hover:shadow-lg hover:bg-opacity-95 transition-all duration-300 border border-white border-opacity-50">
                  <QuestionCard
                    question={discussion}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onReply={handleReply}
                    onViewReplies={handleViewReplies}
                  />
                  
                  {replyingTo === discussion.id && (
                    <div className="border-t border-gray-100 border-opacity-60 p-4 bg-gray-50 bg-opacity-60 backdrop-blur-sm">
                      <ReplyForm
                        questionId={discussion.id}
                        onSubmit={(content, contentType, videoUrl) =>
                          handleSubmitReply(discussion.id, content, contentType, videoUrl)
                        }
                        onCancel={() => setReplyingTo(null)}
                      />
                    </div>
                  )}

                  {viewingReplies === discussion.id && discussion.replies && (
                    <div className="border-t border-gray-100 border-opacity-60 p-4 bg-gray-50 bg-opacity-60 backdrop-blur-sm">
                      <div className="ml-4 space-y-4">
                        {discussion.replies.map((reply) => (
                          <div key={reply.id} className="bg-white bg-opacity-80 backdrop-blur-sm rounded-lg p-3">
                            <ReplyCard
                              reply={reply}
                              onLike={() => handleReplyLike(discussion.id, reply.id)}
                              onDislike={() => handleReplyDislike(discussion.id, reply.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  </>
);
}
export default Discussions;