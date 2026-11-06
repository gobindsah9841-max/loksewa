import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, currentAffairs } from "@/db";
import { ensureDatabaseSeeded } from "@/db/seed";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await ensureDatabaseSeeded();
    const { id } = await context.params;
    const caId = Number(id);
    if (!Number.isInteger(caId) || caId <= 0) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const updates: Record<string, unknown> = {};

    if (typeof body.titleEn === "string" && body.titleEn.trim()) {
      updates.titleEn = body.titleEn.trim();
    }
    if (typeof body.titleNe === "string" && body.titleNe.trim()) {
      updates.titleNe = body.titleNe.trim();
    }
    if (typeof body.summaryEn === "string" && body.summaryEn.trim()) {
      updates.summaryEn = body.summaryEn.trim();
    }
    if (typeof body.summaryNe === "string" && body.summaryNe.trim()) {
      updates.summaryNe = body.summaryNe.trim();
    }
    if (typeof body.category === "string" && body.category.trim()) {
      updates.category = body.category.trim();
    }
    if (
      typeof body.publishedDateBs === "string" &&
      body.publishedDateBs.trim()
    ) {
      updates.publishedDateBs = body.publishedDateBs.trim();
    }
    if (Array.isArray(body.keyPointsEn)) {
      updates.keyPointsEn = JSON.stringify(body.keyPointsEn);
    }
    if (Array.isArray(body.keyPointsNe)) {
      updates.keyPointsNe = JSON.stringify(body.keyPointsNe);
    }

    const [updated] = await db
      .update(currentAffairs)
      .set(updates)
      .where(eq(currentAffairs.id, caId))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Current affair not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ currentAffair: updated });
  } catch (err) {
    console.error("PATCH /api/current-affairs/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update current affair" },
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
    const caId = Number(id);
    if (!Number.isInteger(caId) || caId <= 0) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [deleted] = await db
      .delete(currentAffairs)
      .where(eq(currentAffairs.id, caId))
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Current affair not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ deletedId: deleted.id });
  } catch (err) {
    console.error("DELETE /api/current-affairs/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete current affair" },
      { status: 500 }
    );
  }
}
