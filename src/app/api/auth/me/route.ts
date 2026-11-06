import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db, users } from "@/db";
import { ensureDatabaseSeeded } from "@/db/seed";
import { getActiveUser } from "@/lib/auth";

export async function GET() {
  try {
    await ensureDatabaseSeeded();
    const user = await getActiveUser();
    return NextResponse.json({ user });
  } catch (err) {
    console.error("GET /api/auth/me error:", err);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await ensureDatabaseSeeded();
    const user = await getActiveUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const updates: Partial<{
      name: string;
      targetCommission: string;
      targetLevel: string;
      preferredLang: string;
      preferredTheme: string;
    }> = {};

    if (typeof body.name === "string" && body.name.trim()) {
      updates.name = body.name.trim();
    }
    if (
      typeof body.targetCommission === "string" &&
      body.targetCommission.trim()
    ) {
      updates.targetCommission = body.targetCommission.trim();
    }
    if (typeof body.targetLevel === "string" && body.targetLevel.trim()) {
      updates.targetLevel = body.targetLevel.trim();
    }
    if (body.preferredLang === "en" || body.preferredLang === "ne") {
      updates.preferredLang = body.preferredLang;
    }
    if (body.preferredTheme === "light" || body.preferredTheme === "dark") {
      updates.preferredTheme = body.preferredTheme;
    }

    const [updated] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, user.id))
      .returning();

    return NextResponse.json({
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        targetCommission: updated.targetCommission,
        targetLevel: updated.targetLevel,
        preferredLang: updated.preferredLang,
        preferredTheme: updated.preferredTheme,
        streakDays: updated.streakDays,
        isDemo: updated.email === "aarav@loksewapro.np",
      },
    });
  } catch (err) {
    console.error("PATCH /api/auth/me error:", err);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
