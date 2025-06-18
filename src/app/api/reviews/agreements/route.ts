import { prisma } from '../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const { reviewId } = await request.json();

  if (!reviewId || typeof reviewId !== 'string') {
    return NextResponse.json({ error: 'Review ID missing' }, { status: 400 });
  }

  try {
    const updated = await prisma.review.update({
      where: { id: reviewId },
      data: {
        agreements: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({ success: true, agreements: updated.agreements });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update agreements' }, { status: 500 });
  }
}
