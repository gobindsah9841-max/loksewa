import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, subjects, topics } from "@/db";
import { ensureDatabaseSeeded } from "@/db/seed";

export async function POST(req: Request) {
  try {
    await ensureDatabaseSeeded();
    const body = await req.json();

    const subjectId = Number(body.subjectId);
    const subCategoryEn = String(body.subCategoryEn || "General").trim();
    const subCategoryNe = String(
      body.subCategoryNe || subCategoryEn
    ).trim();
    const nameEn = String(body.nameEn || "").trim();
    const nameNe = String(body.nameNe || nameEn).trim();
    const weightageMarks = Math.max(1, Number(body.weightageMarks) || 5);

    if (!subjectId || !nameEn) {
      return NextResponse.json(
        { error: "Subject ID and Topic Name are required." },
        { status: 400 }
      );
    }

    const [subj] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, subjectId))
      .limit(1);

    if (!subj) {
      return NextResponse.json(
        { error: "Subject not found." },
        { status: 404 }
      );
    }

    const slugBase = nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const slug = `${slugBase}-${Date.now().toString(36)}`;

    const [created] = await db
      .insert(topics)
      .values({
        subjectId: subj.id,
        subCategoryEn,
        subCategoryNe,
        nameEn,
        nameNe,
        slug,
        weightageMarks,
        sortOrder: 99,
      })
      .returning();

    return NextResponse.json({ topic: created }, { status: 201 });
  } catch (err) {
    console.error("POST /api/topics error:", err);
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}
