import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/lib/prisma';
import { Question } from '@/generated/prisma';

interface UserIdentity {
  showName: boolean;
  country: string;
  name: string | null;
}

interface TransformedQuestion extends Question{
  userIdentity: UserIdentity;
}

// GET all questions
export async function GET() {
  try {
const questions = await prisma.question.findMany({
  include: {
    user: {
      select: {
        username: true,
        image: true,
      },
    },
    replies: {
      include: {
        user: {
          select: {
            username: true,
            image: true,
          },
        },
      },
    },
  },
  orderBy: {
    createdAt: 'desc',
  },
});


  // Transform the questions to include userIdentity
  const transformedQuestions: TransformedQuestion[] = questions.map((question) => ({
    ...question,
    userIdentity: {
      showName: question.showName,
      country: question.country || '',
      name: question.showName ? question.user.username : null,
    },
  }));

  return NextResponse.json(transformedQuestions);
} catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}

// POST new question
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { content, categories, showName, country } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const question = await prisma.question.create({
      data: {
        content,
        categories,
        userId: user.id,
        showName,
        country,
        likes: 0,
        dislikes: 0,
      },
      include: {
        user: {
          select: {
            username: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                username: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Transform the question to include userIdentity
    const transformedQuestion = {
      ...question,
      userIdentity: {
        showName: question.showName,
        country: question.country || '',
        name: question.showName ? question.user.username : null,
      },
    };

    return NextResponse.json(transformedQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
} 