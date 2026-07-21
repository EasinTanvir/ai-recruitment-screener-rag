import { db } from "@/lib/db";
import { jobs, applications } from "@/lib/schema";

import { sql, eq, desc } from "drizzle-orm";

export async function getJobs() {
  return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
}
export async function getJobById(id) {
  const jobId = Number(id);

  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));
  if (!job) return null;

  const [{ count }] = await db
    .select({ count: sql`count(*)`.mapWith(Number) })
    .from(applications)
    .where(eq(applications.jobId, jobId));

  return {
    ...job,
    applicantCount: count,
  };
}
