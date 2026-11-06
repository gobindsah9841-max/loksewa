import { ensureDatabaseSeeded } from "@/db/seed";
import { getActiveUser } from "@/lib/auth";
import { getDashboardPayload } from "@/lib/dashboard-service";
import { LoksewaApp } from "@/components/LoksewaApp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureDatabaseSeeded();
  const user = await getActiveUser();
  const payload = await getDashboardPayload(user);

  return <LoksewaApp initialData={payload} />;
}
