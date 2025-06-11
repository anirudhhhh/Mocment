'use client';

import React from 'react';
import { Navbar } from '../components/Navbar';
import Link from 'next/link';

export default function Home() {
 return (
  <>
    <Navbar />
    <main 
      className="min-h-screen bg-gray-50 relative"
      style={{
        backgroundImage: "url('/tab-bg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Optional overlay for better text readability */}
      {/* <div className="absolute inset-0 bg-black bg-opacity-20"></div> */}
      
      <div className="relative z-10 max-w-4xl mx-auto py-8 px-4">
        <header className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          {/* Left Section - Text */}
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-5xl font-bold text-white mb-6 tracking-tight leading-tight font-serif drop-shadow-lg whitespace-nowrap">
              Welcome to Mocment
            </h1>
            <p className="text-xl text-white max-w-2xl mx-auto md:mx-0 leading-relaxed font-light font-sans drop-shadow-md">
              I wrote this when I was designing this website.
            </p>
            <img
              src="/frontpage.jpg"
              alt="Idea"
              className="w-full max-w-[900px] h-auto rounded-lg shadow-md"
            />
          </div>

        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className=" bg-opacity-95 rounded-lg shadow-lg p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4 font-serif">Discussions</h2>
            <p className="text-white mb-4">
              YOUR PROBLEMS ARE NOT UNIQUE. So ask someone who has been there OR just ask something fun OR something you are curious about.
            </p>
            <Link 
              href="/discussions"
              className="inline-block px-6 py-2 bg-slate-800 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Ask Now
            </Link>
          </div>

          <div className=" bg-opacity-95 rounded-lg shadow-lg p-6 backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-white mb-4 font-serif">Reviews</h2>
            <p className="text-white mb-4">
              Share your experiences and discover honest reviews about products, services, and more. Help others make informed decisions.
            </p>
            <Link 
              href="/reviews"
              className="inline-block px-6 py-2 bg-slate-800 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Browse Reviews
            </Link>
          </div>
        </div>

        <div className="flex justify-center gap-6 mb-12">
          <img src="/cafe.png" alt="Idea" className="w-32 h-auto rounded-lg shadow-md" />
          <img src="/food.png" alt="Team" className="w-32 h-auto rounded-lg shadow-md" />
          <img src="/tropical holiday.png" alt="Privacy" className="w-32 h-auto rounded-lg shadow-md" />
          <img src="/Studying, university, online lectures.png" alt="Privacy" className="w-32 h-auto rounded-lg shadow-md" />
          <img src="/clothing.png" alt="Privacy" className="w-32 h-auto rounded-lg shadow-md" />
        </div>

        <div className="text-2xl text-white text-center mb-8 drop-shadow-lg">
          When you want to visit the best cafe or the best hotel or get the best online course for yourself, see what the experienced users have to tell you.
        </div>

         <div className=" bg-opacity-95 rounded-lg shadow-lg p-12 mb-12 backdrop-blur-sm">
          <h2 className="text-4xl font-bold text-white mb-12 text-center font-serif">Why Visit Mocment?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* First Item - Pink Background */}
            <div className="relative">
              <div className="absolute inset-0 bg-pink-200 rounded-3xl transform -rotate-3 opacity-60"></div>
              <div className="relative bg-pink-100 rounded-3xl p-8 text-center">
                <div className="text-6xl font-bold text-pink-400 mb-4 opacity-20">01</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif leading-tight">
                  If you are the one among us who love reading comments!
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Ask and know what others have to say.
                </p>
              </div>
            </div>

            {/* Second Item - Purple Background */}
            <div className="relative">
              <div className="absolute inset-0 bg-purple-200 rounded-3xl transform rotate-2 opacity-60"></div>
              <div className="relative bg-purple-100 rounded-3xl p-8 text-center">
                <div className="text-6xl font-bold text-purple-400 mb-4 opacity-20">02</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif leading-tight">
                  Define your problems here.
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Control your identity and share as much or as little as you want
                </p>
              </div>
            </div>

            {/* Third Item - Teal Background */}
            <div className="relative">
              <div className="absolute inset-0 bg-teal-200 rounded-3xl transform -rotate-1 opacity-60"></div>
              <div className="relative bg-teal-100 rounded-3xl p-8 text-center">
                <div className="text-6xl font-bold text-teal-400 mb-4 opacity-20">03</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif leading-tight">
                  If you want to know what exactly works.
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  There is so much information out there. But what actually works? What is the best?
                </p>
              </div>
            </div>
          </div>
        </div>


        <div className=" bg-opacity-95 p-10 rounded-lg flex flex-col md:flex-row items-center justify-between shadow-md backdrop-blur-sm">
          {/* Left Section */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <p className="text-white font-medium mb-2">How can we help you?</p>
            <h2 className="text-3xl font-bold text-white mb-4">Contact us</h2>
            <p className="text-white mb-6">
              We're here to help and answer any questions you might have. We look forward to hearing from you!
            </p>
            <div className="space-y-4 text-white">
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>+8957635098</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✉️</span>
                <a href="ananya@mocment.com" className="text-blue-600 hover:underline">ananya@mocment.com</a>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="md:w-1/2 flex justify-center">
            <img src="/contact-hello-illustration.png" alt="Hello Illustration" className="w-64 h-auto" />
          </div>
        </div>
      </div>
    </main>
  </>
);
}
