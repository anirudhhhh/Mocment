'use client';

import React from 'react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
            <div className="flex items-center mr-auto">
            <Link href="/" className="text-2xl font-bold text-white-600">
              MOCMENT
            </Link>
            </div>
          
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-white-700 hover:text-white-600">
              Home
            </Link>
            <Link href="/reviews" className="text-white-700 hover:text-white-600">
              Reviews
            </Link>
            <Link href="/discussions" className="text-white-700 hover:text-white-600">
              Discussions
            </Link>
            <Link href="/dashboard" className="text-white-700 hover:text-white-600">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}; 