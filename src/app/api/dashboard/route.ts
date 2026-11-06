import { NextResponse } from "next/server";
import { ensureDatabaseSeeded } from "@/db/seed";
import { getActiveUser } from "@/lib/auth";
import { getDashboardPayload } from "@/lib/dashboard-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDatabaseSeeded();
    const user = await getActiveUser();
    const payload = await getDashboardPayload(user);
    return NextResponse.json(payload);
  } catch (err) {
    console.error("GET /api/dashboard error:", err);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
