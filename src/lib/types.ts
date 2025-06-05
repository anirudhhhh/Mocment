export interface User {
  id: string;
  name: string;
  email: string;
  country: string;
  interests: string[];
  image?: string;
  isPremium: boolean;
  createdAt: Date;
  questions: Question[];
  replies: Reply[];
}

export interface Question {
  id: string;
  content: string;
  categories: string[];
  userId: string;
  likes: number;
  dislikes: number;
  likedBy: string[];
  dislikedBy: string[];
  showName: boolean;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
  replies: Reply[];
  userIdentity?: {
    showName: boolean;
    country: string;
    name: string | null;
  };
}

export interface Reply {
  id: string;
  content: string;
  contentType: 'text' | 'video';
  videoUrl?: string;
  questionId: string;
  userId: string;
  likes: number;
  dislikes: number;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    name: string;
    image?: string;
  };
}

export const CATEGORIES = [
  'Reviews',
  'Life',
  'Startups',
  'Technology',
  'Career',
  'Sports',
  'Fitness',
  'Nutrition',
  'YouTube',
  'Instagram',
  'Facebook',
  'Movies',
  'Decisions',
  'Love',
  'Faith',
  'Family',
  'Marketing',
  'Fashion',
  'AI',
  'ML',
  'Insecurities',
  'College Life',
  'Fears',
  'Health Issues',
  'Jobs',
  'Design',
  'Video Editing',
  'Traveling',
  'Gaming',
  'Music',
  'Social Media',
  'Mental Health',
  'Relationships',
  'Education',
  'Finance',
  'Business',
  'Money',
  'Politics'
] as const; 