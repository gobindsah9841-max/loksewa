import { NextResponse } from "next/server";
import { and, count, eq } from "drizzle-orm";
import {
  db,
  questions,
  userQuestionAttempts,
  studyProgress,
} from "@/db";
import { ensureDatabaseSeeded } from "@/db/seed";
import { getActiveUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await ensureDatabaseSeeded();
    const user = await getActiveUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const questionId = Number(body.questionId);
    const selectedOption = String(body.selectedOption || "")
      .toUpperCase()
      .trim();
    const mode = String(body.mode || "practice").trim();
    const timeSpentSec = Math.max(1, Number(body.timeSpentSec) || 15);

    if (
      !Number.isInteger(questionId) ||
      questionId <= 0 ||
      !["A", "B", "C", "D"].includes(selectedOption)
    ) {
      return NextResponse.json(
        { error: "Valid questionId and selectedOption (A-D) are required." },
        { status: 400 }
      );
    }

    const [q] = await db
      .select()
      .from(questions)
      .where(eq(questions.id, questionId))
      .limit(1);

    if (!q) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    const isCorrect = q.correctOption === selectedOption;

    const [attempt] = await db
      .insert(userQuestionAttempts)
      .values({
        userId: user.id,
        questionId: q.id,
        selectedOption,
        isCorrect,
        mode,
        examSessionId: null,
        timeSpentSec,
      })
      .returning();

    // Update or insert studyProgress for this topic
    const [{ value: topicTotalQuestions }] = await db
      .select({ value: count() })
      .from(questions)
      .where(eq(questions.topicId, q.topicId));

    const [existingProgress] = await db
      .select()
      .from(studyProgress)
      .where(
        and(
          eq(studyProgress.userId, user.id),
          eq(studyProgress.topicId, q.topicId)
        )
      )
      .limit(1);

    if (existingProgress) {
      const nextSolved = existingProgress.questionsSolved + 1;
      const nextCorrect = existingProgress.correctCount + (isCorrect ? 1 : 0);
      const denominator = Math.max(topicTotalQuestions, nextSolved, 1);
      const masteryPct = Math.min(
        100,
        Math.round((nextCorrect / denominator) * 100)
      );

      await db
        .update(studyProgress)
        .set({
          lastQuestionId: q.id,
          questionsSolved: nextSolved,
          correctCount: nextCorrect,
          masteryPct,
          lastStudiedAt: new Date(),
        })
        .where(eq(studyProgress.id, existingProgress.id));
    } else {
      const denominator = Math.max(topicTotalQuestions, 1);
      const masteryPct = isCorrect
        ? Math.min(100, Math.round((1 / denominator) * 100))
        : 15;

      await db.insert(studyProgress).values({
        userId: user.id,
        topicId: q.topicId,
        lastQuestionId: q.id,
        questionsSolved: 1,
        correctCount: isCorrect ? 1 : 0,
        masteryPct,
        lastStudiedAt: new Date(),
      });
    }

    return NextResponse.json({
      attempt,
      isCorrect,
      correctOption: q.correctOption,
      explanationEn: q.explanationEn,
      explanationNe: q.explanationNe,
    });
  } catch (err) {
    console.error("POST /api/attempts error:", err);
    return NextResponse.json(
      { error: "Failed to record attempt" },
      { status: 500 }
    );
  }
}
