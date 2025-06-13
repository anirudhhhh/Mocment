'use client';

import React, { useState } from 'react';
import { Navbar } from '../../components/Navbar';

export default function Contact() {
  const [suggestion, setSuggestion] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(suggestion),
      });

      if (!response.ok) {
        throw new Error('Failed to submit suggestion');
      }

      setSubmitStatus('success');
      setSuggestion({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <header className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions or suggestions? We&apos;d love to hear from you! Reach out to us through any of the channels below or use our suggestion form.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">📧</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <a href="mailto:contact@mocment.com" className="text-blue-600 hover:text-blue-800">
                      contact@mocment.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">📱</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Instagram</h3>
                    <a 
                      href="https://instagram.com/mocment" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      @mocment
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">💬</div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Discord</h3>
                    <a 
                      href="https://discord.gg/mocment" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Join our community
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Suggestion</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={suggestion.name}
                    onChange={(e) => setSuggestion({ ...suggestion, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={suggestion.email}
                    onChange={(e) => setSuggestion({ ...suggestion, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Suggestion
                  </label>
                  <textarea
                    id="message"
                    value={suggestion.message}
                    onChange={(e) => setSuggestion({ ...suggestion, message: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
                </button>
                {submitStatus === 'success' && (
                  <p className="text-green-600 text-center">Thank you for your suggestion! We&apos;ll review it soon.</p>
                )}
                {submitStatus === 'error' && (
                  <p className="text-red-600 text-center">Something went wrong. Please try again later.</p>
                )}
              </form>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-4">
              At Mocment, we&apos;re committed to creating a platform where people can connect, share experiences, and help each other make better decisions. Your feedback and suggestions are invaluable in helping us improve and grow.
            </p>
            <p className="text-gray-600">
              Whether you have a feature request, found a bug, or just want to share your thoughts, we&apos;re here to listen. Together, we can make Mocment even better for everyone.
            </p>
          </div>
        </div>
      </main>
    </>
  );
} 