import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db, userBookmarks } from "@/db";
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
    const bookmarkId = Number(id);
    if (!Number.isInteger(bookmarkId) || bookmarkId <= 0) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();
    const personalNote =
      typeof body.personalNote === "string" ? body.personalNote.trim() : "";

    const [updated] = await db
      .update(userBookmarks)
      .set({ personalNote })
      .where(
        and(
          eq(userBookmarks.id, bookmarkId),
          eq(userBookmarks.userId, user.id)
        )
      )
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ bookmark: updated });
  } catch (err) {
    console.error("PATCH /api/bookmarks/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to update bookmark" },
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
    const bookmarkId = Number(id);
    if (!Number.isInteger(bookmarkId) || bookmarkId <= 0) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const [deleted] = await db
      .delete(userBookmarks)
      .where(
        and(
          eq(userBookmarks.id, bookmarkId),
          eq(userBookmarks.userId, user.id)
        )
      )
      .returning();

    if (!deleted) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ deletedId: deleted.id });
  } catch (err) {
    console.error("DELETE /api/bookmarks/[id] error:", err);
    return NextResponse.json(
      { error: "Failed to delete bookmark" },
      { status: 500 }
    );
  }
}
