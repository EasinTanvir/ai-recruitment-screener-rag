import { db } from "@/lib/db";
import { jobs, applications } from "@/lib/schema";

import { authorize } from "@/lib/authorization";
import { and, desc, eq, sql } from "drizzle-orm";

export async function getJobs(page = 1, limit = 6) {
  const offset = (page - 1) * limit;

  const [items, [{ total }]] = await Promise.all([
    db
      .select()
      .from(jobs)
      .orderBy(desc(jobs.createdAt))
      .limit(limit)
      .offset(offset),

    db
      .select({
        total: sql`count(*)`.mapWith(Number),
      })
      .from(jobs),
  ]);

  return {
    jobs: items,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}
export async function getJobById(id) {
  const jobId = Number(id);

  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));

  if (!job) return null;

  const [{ count }] = await db
    .select({
      count: sql`count(*)`.mapWith(Number),
    })
    .from(applications)
    .where(eq(applications.jobId, jobId));

  let alreadyApplied = false;

  const auth = await authorize();

  if (auth.success) {
    const [application] = await db
      .select({
        id: applications.id,
      })
      .from(applications)
      .where(
        and(
          eq(applications.jobId, jobId),
          eq(applications.candidateId, auth.user.id),
        ),
      )
      .limit(1);

    alreadyApplied = !!application;
  }

  return {
    ...job,
    applicantCount: count,
    alreadyApplied,
  };
}
