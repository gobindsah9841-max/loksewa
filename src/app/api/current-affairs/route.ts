import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, currentAffairs, questions, subjects, topics } from "@/db";
import { ensureDatabaseSeeded } from "@/db/seed";
import { getActiveUser } from "@/lib/auth";
import { getDashboardPayload } from "@/lib/dashboard-service";

export async function GET() {
  try {
    await ensureDatabaseSeeded();
    const user = await getActiveUser();
    const payload = await getDashboardPayload(user);
    return NextResponse.json({ currentAffairs: payload.currentAffairs });
  } catch (err) {
    console.error("GET /api/current-affairs error:", err);
    return NextResponse.json(
      { error: "Failed to fetch current affairs" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await ensureDatabaseSeeded();
    const user = await getActiveUser();
    const body = await req.json();

    const titleEn = String(body.titleEn || "").trim();
    const titleNe = String(body.titleNe || titleEn).trim();
    const summaryEn = String(body.summaryEn || "").trim();
    const summaryNe = String(body.summaryNe || summaryEn).trim();
    const category = String(body.category || "National").trim();
    const publishedDateBs = String(
      body.publishedDateBs || "2082 Baisakh"
    ).trim();
    const publishedDateAd = String(
      body.publishedDateAd || new Date().toISOString().slice(0, 10)
    ).trim();

    if (!titleEn || !summaryEn) {
      return NextResponse.json(
        { error: "Title and Summary are required." },
        { status: 400 }
      );
    }

    const keyPointsEn = Array.isArray(body.keyPointsEn)
      ? body.keyPointsEn.map(String).filter(Boolean)
      : typeof body.keyPointsEn === "string"
        ? body.keyPointsEn
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [summaryEn];

    const keyPointsNe = Array.isArray(body.keyPointsNe)
      ? body.keyPointsNe.map(String).filter(Boolean)
      : typeof body.keyPointsNe === "string" && body.keyPointsNe.trim()
        ? body.keyPointsNe
            .split("\n")
            .map((s: string) => s.trim())
            .filter(Boolean)
        : keyPointsEn;

    let linkedQuestionId: number | null = body.linkedQuestionId
      ? Number(body.linkedQuestionId)
      : null;

    // Optional inline exam-oriented MCQ creation
    if (
      body.mcq &&
      typeof body.mcq.questionEn === "string" &&
      body.mcq.questionEn.trim() &&
      body.mcq.optionAEn &&
      body.mcq.optionBEn &&
      body.mcq.optionCEn &&
      body.mcq.optionDEn
    ) {
      const [caSubj] = await db
        .select()
        .from(subjects)
        .where(eq(subjects.code, "CA"))
        .limit(1);

      const caTopics = caSubj
        ? await db
            .select()
            .from(topics)
            .where(eq(topics.subjectId, caSubj.id))
            .limit(1)
        : [];

      const fallbackTopics =
        caTopics.length > 0 ? caTopics : await db.select().from(topics).limit(1);

      if (fallbackTopics[0]) {
        const [newQ] = await db
          .insert(questions)
          .values({
            subjectId: fallbackTopics[0].subjectId,
            topicId: fallbackTopics[0].id,
            questionEn: String(body.mcq.questionEn).trim(),
            questionNe: String(
              body.mcq.questionNe || body.mcq.questionEn
            ).trim(),
            optionAEn: String(body.mcq.optionAEn).trim(),
            optionANe: String(
              body.mcq.optionANe || body.mcq.optionAEn
            ).trim(),
            optionBEn: String(body.mcq.optionBEn).trim(),
            optionBNe: String(
              body.mcq.optionBNe || body.mcq.optionBEn
            ).trim(),
            optionCEn: String(body.mcq.optionCEn).trim(),
            optionCNe: String(
              body.mcq.optionCNe || body.mcq.optionCEn
            ).trim(),
            optionDEn: String(body.mcq.optionDEn).trim(),
            optionDNe: String(
              body.mcq.optionDNe || body.mcq.optionDEn
            ).trim(),
            correctOption: ["A", "B", "C", "D"].includes(
              String(body.mcq.correctOption || "A").toUpperCase()
            )
              ? String(body.mcq.correctOption).toUpperCase()
              : "A",
            explanationEn: String(
              body.mcq.explanationEn || summaryEn
            ).trim(),
            explanationNe: String(
              body.mcq.explanationNe || summaryNe
            ).trim(),
            difficulty: "medium",
            commission: "Federal",
            examLevel: "Fifth Level - General Administration",
            isImportant: true,
            createdByUserId: user?.id ?? null,
          })
          .returning();

        linkedQuestionId = newQ.id;
      }
    }

    const [created] = await db
      .insert(currentAffairs)
      .values({
        titleEn,
        titleNe,
        summaryEn,
        summaryNe,
        keyPointsEn: JSON.stringify(keyPointsEn),
        keyPointsNe: JSON.stringify(keyPointsNe),
        category,
        publishedDateBs,
        publishedDateAd,
        linkedQuestionId,
        isImportant: body.isImportant !== undefined ? Boolean(body.isImportant) : true,
      })
      .returning();

    return NextResponse.json({ currentAffair: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/current-affairs error:", err);
    return NextResponse.json(
      { error: "Failed to create current affair" },
      { status: 500 }
    );
  }
}
