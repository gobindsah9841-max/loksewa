import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db, mockExamSessions, questions } from "@/db";
import { ensureDatabaseSeeded } from "@/db/seed";
import { getActiveUser } from "@/lib/auth";
import { getDashboardPayload } from "@/lib/dashboard-service";

export async function GET() {
  try {
    await ensureDatabaseSeeded();
    const user = await getActiveUser();
    if (!user) {
      return NextResponse.json({ exams: [] });
    }
    const rows = await db
      .select()
      .from(mockExamSessions)
      .where(eq(mockExamSessions.userId, user.id))
      .orderBy(desc(mockExamSessions.startedAt));
    return NextResponse.json({ exams: rows });
  } catch (err) {
    console.error("GET /api/exams error:", err);
    return NextResponse.json(
      { error: "Failed to load exams" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabaseSeeded();
    const user = await getActiveUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const examType = String(body.examType || "full_mock").trim();
    const commission = String(
      body.commission || user.targetCommission || "Federal (Loksewa Aayog)"
    ).trim();
    const negativeMarking =
      body.negativeMarking !== undefined ? Boolean(body.negativeMarking) : true;
    const subjectIdFilter =
      body.subjectId && body.subjectId !== "all"
        ? Number(body.subjectId)
        : null;

    const payload = await getDashboardPayload(user);
    let pool = payload.questions;

    if (examType === "daily_challenge") {
      const dailyPool = pool.filter((q) => q.isDailyChallenge);
      pool = dailyPool.length >= 5 ? dailyPool : pool.slice(0, 10);
    } else if (examType === "previous_year") {
      const pyPool = pool.filter((q) => q.isPreviousYear);
      pool = pyPool.length >= 5 ? pyPool : pool;
    } else if (subjectIdFilter) {
      const subjPool = pool.filter((q) => q.subjectId === subjectIdFilter);
      if (subjPool.length > 0) pool = subjPool;
    }

    // Shuffle pool deterministically/randomly and pick requested count
    const requestedCount = Math.min(
      pool.length,
      Math.max(5, Number(body.questionCount) || 20)
    );
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffled.slice(0, requestedCount);
    const questionIds = selectedQuestions.map((q) => q.id);

    const durationMinutes = Math.max(
      5,
      Number(body.durationMinutes) || requestedCount
    );

    const titleEn =
      typeof body.titleEn === "string" && body.titleEn.trim()
        ? body.titleEn.trim()
        : examType === "daily_challenge"
          ? "Daily Loksewa GK & IQ Challenge"
          : `${commission} — Fifth Level Mock Examination (${requestedCount} Qs)`;

    const titleNe =
      typeof body.titleNe === "string" && body.titleNe.trim()
        ? body.titleNe.trim()
        : examType === "daily_challenge"
          ? "दैनिक लोकसेवा सामान्य ज्ञान तथा बौद्धिक परीक्षण चुनौती"
          : `${commission} — पाँचौं तह नमुना परीक्षा (${requestedCount} प्रश्न)`;

    const [created] = await db
      .insert(mockExamSessions)
      .values({
        userId: user.id,
        titleEn,
        titleNe,
        commission,
        examType,
        totalQuestions: selectedQuestions.length,
        attemptedQuestions: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
        negativeMarking,
        netScore: "0.00",
        accuracyPct: 0,
        durationMinutes,
        timeTakenSeconds: 0,
        status: "in_progress",
        questionIdsJson: JSON.stringify(questionIds),
        answersJson: "{}",
      })
      .returning();

    return NextResponse.json(
      {
        exam: {
          ...created,
          questionIds,
          answers: {},
        },
        questions: selectedQuestions,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/exams error:", err);
    return NextResponse.json(
      { error: "Failed to start examination" },
      { status: 500 }
    );
  }
}
