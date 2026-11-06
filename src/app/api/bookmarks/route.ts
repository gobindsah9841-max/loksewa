import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, userBookmarks } from "@/db";
import { ensureDatabaseSeeded } from "@/db/seed";
import { getActiveUser } from "@/lib/auth";

export async function GET() {
  try {
    await ensureDatabaseSeeded();
    const user = await getActiveUser();
    if (!user) {
      return NextResponse.json({ bookmarks: [] });
    }
    const rows = await db
      .select()
      .from(userBookmarks)
      .where(eq(userBookmarks.userId, user.id));
    return NextResponse.json({ bookmarks: rows });
  } catch (err) {
    console.error("GET /api/bookmarks error:", err);
    return NextResponse.json(
      { error: "Failed to load bookmarks" },
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
    const questionId = Number(body.questionId);
    const personalNote =
      typeof body.personalNote === "string" ? body.personalNote.trim() : "";
    const toggle = body.toggle !== false;

    if (!Number.isInteger(questionId) || questionId <= 0) {
      return NextResponse.json(
        { error: "Valid questionId is required" },
        { status: 400 }
      );
    }

    const [existing] = await db
      .select()
      .from(userBookmarks)
      .where(
        and(
          eq(userBookmarks.userId, user.id),
          eq(userBookmarks.questionId, questionId)
        )
      )
      .limit(1);

    if (existing) {
      if (toggle && body.personalNote === undefined) {
        await db
          .delete(userBookmarks)
          .where(eq(userBookmarks.id, existing.id));
        return NextResponse.json({ bookmarked: false, bookmark: null });
      }
      const [updated] = await db
        .update(userBookmarks)
        .set({ personalNote })
        .where(eq(userBookmarks.id, existing.id))
        .returning();
      return NextResponse.json({ bookmarked: true, bookmark: updated });
    }

    const [created] = await db
      .insert(userBookmarks)
      .values({
        userId: user.id,
        questionId,
        personalNote,
      })
      .returning();

    return NextResponse.json(
      { bookmarked: true, bookmark: created },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/bookmarks error:", err);
    return NextResponse.json(
      { error: "Failed to update bookmark" },
      { status: 500 }
    );
  }
}
