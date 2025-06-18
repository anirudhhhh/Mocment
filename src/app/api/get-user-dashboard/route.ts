// app/api/get-user-dashboard/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/authOptions';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      questions: {
        include: {
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
      },
      replies: {
        include: {
          question: true,
          user: {
            select: {
              username: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Transform questions to include userIdentity
  const transformedUser = {
    ...user,
    questions: user.questions.map((question: any) => ({
      ...question,
      userIdentity: {
        showName: question.showName,
        country: question.country || '',
        name: question.showName ? user.username : null,
      },
    })),
  };

  return NextResponse.json(transformedUser);
}
