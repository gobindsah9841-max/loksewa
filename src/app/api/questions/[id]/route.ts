import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, questions, topics } from "@/db";
import { ensureDatabaseSeeded } from "@/db/seed";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseSeeded();
    const { id } = await context.params;
    const questionId = Number(id);
    if (!Number.isInteger(questionId) || questionId <= 0) {
      return NextResponse.json(
        { error: "Invalid question ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const updates: Record<string, unknown> = {};

    if (typeof body.topicId === "number") {
      const [top] = await db
        .select()
        .from(topics)
        .where(eq(topics.id, body.topicId))
        .limit(1);
      if (top) {
        updates.topicId = top.id;
        updates.subjectId = top.subjectId;
      }
    }

    if (typeof body.questionEn === "string" && body.questionEn.trim()) {
      updates.questionEn = body.questionEn.trim();
    }
    if (typeof body.questionNe === "string" && body.questionNe.trim()) {
      updates.questionNe = body.questionNe.trim();
    }
    if (typeof body.optionAEn === "string" && body.optionAEn.trim()) {
      updates.optionAEn = body.optionAEn.trim();
    }
    if (typeof body.optionANe === "string" && body.optionANe.trim()) {
      updates.optionANe = body.optionANe.trim();
    }
    if (typeof body.optionBEn === "string" && body.optionBEn.trim()) {
      updates.optionBEn = body.optionBEn.trim();
    }
    if (typeof body.optionBNe === "string" && body.optionBNe.trim()) {
      updates.optionBNe = body.optionBNe.trim();
    }
    if (typeof body.optionCEn === "string" && body.optionCEn.trim()) {
      updates.optionCEn = body.optionCEn.trim();
    }
    if (typeof body.optionCNe === "string" && body.optionCNe.trim()) {
      updates.optionCNe = body.optionCNe.trim();
    }
    if (typeof body.optionDEn === "string" && body.optionDEn.trim()) {
      updates.optionDEn = body.optionDEn.trim();
    }
    if (typeof body.optionDNe === "string" && body.optionDNe.trim()) {
      updates.optionDNe = body.optionDNe.trim();
    }
    if (
      typeof body.correctOption === "string" &&
      ["A", "B", "C", "D"].includes(body.correctOption.toUpperCase())
    ) {
      updates.correctOption = body.correctOption.toUpperCase();
    }
    if (typeof body.explanationEn === "string" && body.explanationEn.trim()) {
      updates.explanationEn = body.explanationEn.trim();
    }
    if (typeof body.explanationNe === "string" && body.explanationNe.trim()) {
      updates.explanationNe = body.explanationNe.trim();
    }
    if (
      typeof body.difficulty === "string" &&
      ["easy", "medium", "hard"].includes(body.difficulty)
    ) {
      updates.difficulty = body.difficulty;
    }
    if (typeof body.commission === "string" && body.commission.trim()) {
      updates.commission = body.commission.trim();
    }
    if (typeof body.isImportant === "boolean") {
      updates.isImportant = body.isImportant;
    }
    if (typeof body.isPreviousYear === "boolean") {
      updates.isPreviousYear = body.isPreviousYear;
    }
    if (typeof body.isDailyChallenge === "boolean") {
      updates.isDailyChallenge = body.isDailyChallenge;
    }
    if (body.previousYearInfo !== undefined) {
      updates.previousYearInfo = body.previousYearInfo
        ? String(body.previousYearInfo).trim()
        : null;
    }

    const [updated] = await db
      .update(questions)
      .set(updates)
      .where(eq(questions.id, questionId))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ question: updated });
  } catch (err) {
    console.error("PATCH /api/questions/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update question" },
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
    const { id } = await context.params;
    const questionId = Number(id);
    if (!Number.isInteger(questionId) || questionId <= 0) {
      return NextResponse.json(
        { error: "Invalid question ID" },
        { status: 400 }
      );
    }

    const [deleted] = await db
      .delete(questions)
      .where(eq(questions.id, questionId))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ deletedId: deleted.id });
  } catch (err) {
    console.error("DELETE /api/questions/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}
