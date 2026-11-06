import { randomBytes, scryptSync } from "crypto";
import { asc, eq } from "drizzle-orm";
import { db, users } from "@/db";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export type PublicUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  targetCommission: string;
  targetLevel: string;
  preferredLang: string;
  preferredTheme: string;
  streakDays: number;
  isDemo: boolean;
};

export async function getActiveUser(): Promise<PublicUser | null> {
  const [primaryUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, "aarav@loksewapro.np"))
    .limit(1);

  const found =
    primaryUser ??
    (await db.select().from(users).orderBy(asc(users.id)).limit(1))[0];

  if (!found) return null;

  return {
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role,
    targetCommission: found.targetCommission,
    targetLevel: found.targetLevel,
    preferredLang: found.preferredLang,
    preferredTheme: found.preferredTheme,
    streakDays: found.streakDays,
    isDemo: true,
  };
}
