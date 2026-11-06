import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, topics } from "@/db";
import { ensureDatabaseSeeded } from "@/db/seed";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseSeeded();
    const { id } = await context.params;
    const topicId = Number(id);
    if (!Number.isInteger(topicId) || topicId <= 0) {
      return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
    }

    const body = await req.json();
    const updates: Record<string, unknown> = {};
    if (typeof body.nameEn === "string" && body.nameEn.trim()) {
      updates.nameEn = body.nameEn.trim();
    }
    if (typeof body.nameNe === "string" && body.nameNe.trim()) {
      updates.nameNe = body.nameNe.trim();
    }
    if (typeof body.weightageMarks === "number" && body.weightageMarks > 0) {
      updates.weightageMarks = body.weightageMarks;
    }

    const [updated] = await db
      .update(topics)
      .set(updates)
      .where(eq(topics.id, topicId))
      .returning();

    if (!updated) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json({ topic: updated });
  } catch (err) {
    console.error("PATCH /api/topics/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update topic" },
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
    const topicId = Number(id);
    if (!Number.isInteger(topicId) || topicId <= 0) {
      return NextResponse.json({ error: "Invalid topic ID" }, { status: 400 });
    }

    const [deleted] = await db
      .delete(topics)
      .where(eq(topics.id, topicId))
      .returning();

    if (!deleted) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json({ deletedId: deleted.id });
  } catch (err) {
    console.error("DELETE /api/topics/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
}
