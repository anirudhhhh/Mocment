import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export async function GET(): Promise<NextResponse> {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            username: true,
            image: true
          }
        }
      }
    });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
  interface RequestBody {
  title: string;
  videoUrl?: string | null;
  imageUrl?: string | null;
  category: string;
  description: string;
  rating: number;
}

const { 
  title, 
  videoUrl = null, 
  imageUrl = null, 
  category, 
  description, 
  rating 
}: RequestBody = body;

    const review = await prisma.review.create({
      data: {
        title,
        videoUrl,
        imageUrl,
        category,
        description,
        rating,
        userId: session.user.id,
        agreements: 0, 
        views: 0
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
} 