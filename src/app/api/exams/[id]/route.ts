import { NextResponse } from "next/server";
import { and, count, eq, inArray } from "drizzle-orm";
import {
  db,
  mockExamSessions,
  questions,
  userQuestionAttempts,
  studyProgress,
  users,
} from "@/db";
import { ensureDatabaseSeeded } from "@/db/seed";
import { getActiveUser } from "@/lib/auth";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseSeeded();
    const user = await getActiveUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const examId = Number(id);
    if (!Number.isInteger(examId) || examId <= 0) {
      return NextResponse.json({ error: "Invalid exam ID" }, { status: 400 });
    }

    const [session] = await db
      .select()
      .from(mockExamSessions)
      .where(
        and(
          eq(mockExamSessions.id, examId),
          eq(mockExamSessions.userId, user.id)
        )
      )
      .limit(1);

    if (!session) {
      return NextResponse.json(
        { error: "Examination session not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const answers: Record<string, string> =
      body.answers && typeof body.answers === "object" ? body.answers : {};
    const timeTakenSeconds = Math.max(
      1,
      Number(body.timeTakenSeconds) || session.durationMinutes * 60
    );

    let questionIds: number[] = [];
    try {
      questionIds = JSON.parse(session.questionIdsJson);
    } catch {
      questionIds = [];
    }

    const examQuestions =
      questionIds.length > 0
        ? await db
            .select()
            .from(questions)
            .where(inArray(questions.id, questionIds))
        : [];

    const questionById = new Map(examQuestions.map((q) => [q.id, q]));

    let attemptedQuestions = 0;
    let correctAnswers = 0;
    let wrongAnswers = 0;
    const cleanAnswers: Record<string, string> = {};
    const newAttemptRows: Array<{
      userId: number;
      questionId: number;
      selectedOption: string;
      isCorrect: boolean;
      mode: string;
      examSessionId: number;
      timeSpentSec: number;
    }> = [];

    const topicUpdates = new Map<
      number,
      { solved: number; correct: number; lastQId: number }
    >();

    const avgSecPerQ = Math.max(
      5,
      Math.round(timeTakenSeconds / Math.max(Object.keys(answers).length, 1))
    );

    for (const qId of questionIds) {
      const q = questionById.get(qId);
      if (!q) continue;
      const rawChoice = answers[String(qId)];
      if (!rawChoice) continue;
      const choice = String(rawChoice).toUpperCase().trim();
      if (!["A", "B", "C", "D"].includes(choice)) continue;

      cleanAnswers[String(qId)] = choice;
      attemptedQuestions += 1;
      const isCorrect = q.correctOption === choice;
      if (isCorrect) {
        correctAnswers += 1;
      } else {
        wrongAnswers += 1;
      }

      newAttemptRows.push({
        userId: user.id,
        questionId: q.id,
        selectedOption: choice,
        isCorrect,
        mode:
          session.examType === "daily_challenge"
            ? "daily_challenge"
            : "mock_exam",
        examSessionId: session.id,
        timeSpentSec: avgSecPerQ,
      });

      const prevT = topicUpdates.get(q.topicId) ?? {
        solved: 0,
        correct: 0,
        lastQId: q.id,
      };
      prevT.solved += 1;
      if (isCorrect) prevT.correct += 1;
      prevT.lastQId = q.id;
      topicUpdates.set(q.topicId, prevT);
    }

    const rawNet = session.negativeMarking
      ? correctAnswers - wrongAnswers * 0.2
      : correctAnswers;
    const netScore = rawNet.toFixed(2);
    const accuracyPct =
      attemptedQuestions > 0
        ? Math.round((correctAnswers / attemptedQuestions) * 100)
        : 0;

    const [updatedSession] = await db
      .update(mockExamSessions)
      .set({
        attemptedQuestions,
        correctAnswers,
        wrongAnswers,
        netScore,
        accuracyPct,
        timeTakenSeconds,
        status: "completed",
        answersJson: JSON.stringify(cleanAnswers),
        completedAt: new Date(),
      })
      .where(eq(mockExamSessions.id, session.id))
      .returning();

    if (newAttemptRows.length > 0 && session.status !== "completed") {
      await db.insert(userQuestionAttempts).values(newAttemptRows);

      for (const [topicId, stats] of topicUpdates.entries()) {
        const [{ value: topicTotal }] = await db
          .select({ value: count() })
          .from(questions)
          .where(eq(questions.topicId, topicId));

        const [existingProg] = await db
          .select()
          .from(studyProgress)
          .where(
            and(
              eq(studyProgress.userId, user.id),
              eq(studyProgress.topicId, topicId)
            )
          )
          .limit(1);

        if (existingProg) {
          const nextSolved = existingProg.questionsSolved + stats.solved;
          const nextCorrect = existingProg.correctCount + stats.correct;
          const denom = Math.max(topicTotal, nextSolved, 1);
          await db
            .update(studyProgress)
            .set({
              lastQuestionId: stats.lastQId,
              questionsSolved: nextSolved,
              correctCount: nextCorrect,
              masteryPct: Math.min(100, Math.round((nextCorrect / denom) * 100)),
              lastStudiedAt: new Date(),
            })
            .where(eq(studyProgress.id, existingProg.id));
        } else {
          const denom = Math.max(topicTotal, stats.solved, 1);
          await db.insert(studyProgress).values({
            userId: user.id,
            topicId,
            lastQuestionId: stats.lastQId,
            questionsSolved: stats.solved,
            correctCount: stats.correct,
            masteryPct: Math.min(
              100,
              Math.max(15, Math.round((stats.correct / denom) * 100))
            ),
            lastStudiedAt: new Date(),
          });
        }
      }

      if (session.examType === "daily_challenge") {
        await db
          .update(users)
          .set({ streakDays: user.streakDays + 1 })
          .where(eq(users.id, user.id));
      }
    }

    return NextResponse.json({
      exam: {
        ...updatedSession,
        questionIds,
        answers: cleanAnswers,
      },
    });
  } catch (err) {
    console.error("PATCH /api/exams/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to submit examination" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseSeeded();
    const user = await getActiveUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const examId = Number(id);
    if (!Number.isInteger(examId) || examId <= 0) {
      return NextResponse.json({ error: "Invalid exam ID" }, { status: 400 });
    }

    const [deleted] = await db
      .delete(mockExamSessions)
      .where(
        and(
          eq(mockExamSessions.id, examId),
          eq(mockExamSessions.userId, user.id)
        )
      )
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Examination session not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ deletedId: deleted.id });
  } catch (err) {
    console.error("DELETE /api/exams/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete examination session" },
      { status: 500 }
    );
  }
}
