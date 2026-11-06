import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, questions, topics } from "@/db";
import { ensureDatabaseSeeded } from "@/db/seed";
import { getActiveUser } from "@/lib/auth";
import { getDashboardPayload } from "@/lib/dashboard-service";

export async function GET(req: Request) {
  try {
    await ensureDatabaseSeeded();
    const user = await getActiveUser();
    const payload = await getDashboardPayload(user);
    const { searchParams } = new URL(req.url);

    const subjectId = searchParams.get("subjectId");
    const topicId = searchParams.get("topicId");
    const commission = searchParams.get("commission");
    const difficulty = searchParams.get("difficulty");
    const filter = searchParams.get("filter");
    const search = (searchParams.get("q") || "").trim().toLowerCase();

    let filtered = payload.questions;

    if (subjectId && subjectId !== "all") {
      filtered = filtered.filter((q) => q.subjectId === Number(subjectId));
    }
    if (topicId && topicId !== "all") {
      filtered = filtered.filter((q) => q.topicId === Number(topicId));
    }
    if (commission && commission !== "all") {
      filtered = filtered.filter((q) =>
        q.commission.toLowerCase().includes(commission.toLowerCase())
      );
    }
    if (difficulty && difficulty !== "all") {
      filtered = filtered.filter((q) => q.difficulty === difficulty);
    }
    if (filter === "previous_year") {
      filtered = filtered.filter((q) => q.isPreviousYear);
    } else if (filter === "important") {
      filtered = filtered.filter((q) => q.isImportant);
    } else if (filter === "daily_challenge") {
      filtered = filtered.filter((q) => q.isDailyChallenge);
    } else if (filter === "bookmarked") {
      filtered = filtered.filter((q) => q.isBookmarked);
    } else if (filter === "incorrect") {
      filtered = filtered.filter((q) => q.isUnresolvedIncorrect);
    }

    if (search) {
      filtered = filtered.filter(
        (q) =>
          q.questionEn.toLowerCase().includes(search) ||
          q.questionNe.toLowerCase().includes(search) ||
          q.topicNameEn.toLowerCase().includes(search) ||
          q.topicNameNe.toLowerCase().includes(search)
      );
    }

    return NextResponse.json({ questions: filtered });
  } catch (err) {
    console.error("GET /api/questions error:", err);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabaseSeeded();
    const user = await getActiveUser();
    const body = await req.json();

    const topicId = Number(body.topicId);
    const questionEn = String(body.questionEn || "").trim();
    const questionNe = String(body.questionNe || questionEn).trim();
    const optionAEn = String(body.optionAEn || "").trim();
    const optionANe = String(body.optionANe || optionAEn).trim();
    const optionBEn = String(body.optionBEn || "").trim();
    const optionBNe = String(body.optionBNe || optionBEn).trim();
    const optionCEn = String(body.optionCEn || "").trim();
    const optionCNe = String(body.optionCNe || optionCEn).trim();
    const optionDEn = String(body.optionDEn || "").trim();
    const optionDNe = String(body.optionDNe || optionDEn).trim();
    const correctOption = String(body.correctOption || "A")
      .toUpperCase()
      .trim();
    const explanationEn = String(
      body.explanationEn || "Verified Loksewa preparation answer."
    ).trim();
    const explanationNe = String(
      body.explanationNe || explanationEn
    ).trim();

    if (
      !topicId ||
      !questionEn ||
      !optionAEn ||
      !optionBEn ||
      !optionCEn ||
      !optionDEn ||
      !["A", "B", "C", "D"].includes(correctOption)
    ) {
      return NextResponse.json(
        {
          error:
            "Topic, question text, all four options (A-D), and a valid correct option are required.",
        },
        { status: 400 }
      );
    }

    const [topicRow] = await db
      .select()
      .from(topics)
      .where(eq(topics.id, topicId))
      .limit(1);

    if (!topicRow) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const [created] = await db
      .insert(questions)
      .values({
        subjectId: topicRow.subjectId,
        topicId: topicRow.id,
        questionEn,
        questionNe,
        optionAEn,
        optionANe,
        optionBEn,
        optionBNe,
        optionCEn,
        optionCNe,
        optionDEn,
        optionDNe,
        correctOption,
        explanationEn,
        explanationNe,
        difficulty: ["easy", "medium", "hard"].includes(body.difficulty)
          ? body.difficulty
          : "medium",
        commission: String(body.commission || "Federal").trim(),
        examLevel: String(
          body.examLevel || "Fifth Level - General Administration"
        ).trim(),
        isPreviousYear: Boolean(body.isPreviousYear),
        previousYearInfo: body.previousYearInfo
          ? String(body.previousYearInfo).trim()
          : null,
        isImportant: Boolean(body.isImportant),
        isDailyChallenge: Boolean(body.isDailyChallenge),
        createdByUserId: user?.id ?? null,
      })
      .returning();

    return NextResponse.json({ question: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/questions error:", err);
    return NextResponse.json(
      { error: "Failed to create question" },
      { status: 500 }
    );
  }
}
