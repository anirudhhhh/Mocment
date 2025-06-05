import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export async function GET() {
  try {
    // Get current date
    const now = new Date();
    const currentWeek = getWeekNumber(now);
    const currentYear = now.getFullYear();

    // Fetch the WeeklyStar with its associated Question and User
    const star = await prisma.weeklyStar.findFirst({
      where: {
        week: currentWeek,
        year: currentYear,
      },
      include: {
        question: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!star) {
      // If no star question exists for this week, get the most liked question
      const mostLikedQuestion = await prisma.question.findFirst({
        orderBy: {
          likes: 'desc',
        },
        include: {
          user: true,
        },
      });

      if (!mostLikedQuestion) {
        return NextResponse.json({ message: "No questions found" }, { status: 404 });
      }

      // Create a new weekly star
      await prisma.weeklyStar.create({
        data: {
          questionId: mostLikedQuestion.id,
          week: currentWeek,
          year: currentYear,
        },
      });

      return NextResponse.json(mostLikedQuestion);
    }

    return NextResponse.json(star.question);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error fetching star question" }, { status: 500 });
  }
}
