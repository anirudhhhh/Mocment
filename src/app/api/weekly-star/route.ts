import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const now = new Date();
    const week = getWeekNumber(now);
    const year = now.getFullYear();

    // Check if a star question is already selected
    const existing = await prisma.weeklyStar.findFirst({
      where: { week, year },
    });

    if (existing) {
      return NextResponse.json({ message: "Star question already selected for this week" }, { status: 409 });
    }

    // Get all questions created this week
    const startOfWeek = getStartOfWeek(now);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const questions = await prisma.question.findMany({
      where: {
        createdAt: {
          gte: startOfWeek,
          lt: endOfWeek,
        },
      },
    });

    // Find question with most thumbs-up
    const mostLiked = questions.reduce((max: typeof questions[0] | null, q: typeof questions[0]) => {
      return q.thumbsUp.length > (max?.thumbsUp.length || 0) ? q : max;
    }, null);

    if (!mostLiked) {
      return NextResponse.json({ message: "No questions found this week" }, { status: 404 });
    }

    // Save to WeeklyStar collection
    const newStar = await prisma.weeklyStar.create({
      data: {
        week,
        year,
        questionId: mostLiked.id,
      },
    });

    return NextResponse.json({ message: "Star question selected", data: newStar });
  } catch (error) {
    console.error("Weekly star error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// Utility: Get week number (ISO standard)
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// Utility: Get start of week (Monday)
function getStartOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday
  return new Date(date.setDate(diff));
}
