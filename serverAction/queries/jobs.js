import { db } from "@/lib/db";
import { jobs, applications } from "@/lib/schema";

import { authorize } from "@/lib/authorization";
import { and, desc, eq, sql } from "drizzle-orm";

export async function getJobs(page = 1, limit = 6) {
  const offset = (page - 1) * limit;

  const [items, [{ total }]] = await Promise.all([
    db
      .select({
        id: jobs.id,
        title: jobs.title,
        companyName: jobs.companyName,
        description: jobs.description,
        requirements: jobs.requirements,
        status: jobs.status,
        publishedAt: jobs.publishedAt,
        createdAt: jobs.createdAt,
        updatedAt: jobs.updatedAt,

        applicantCount: sql`COUNT(${applications.id})`.mapWith(Number),
      })
      .from(jobs)
      .leftJoin(applications, eq(applications.jobId, jobs.id))
      .groupBy(
        jobs.id,
        jobs.title,
        jobs.companyName,
        jobs.description,
        jobs.requirements,
        jobs.status,
        jobs.publishedAt,
        jobs.createdAt,
        jobs.updatedAt,
      )
      .orderBy(desc(jobs.createdAt))
      .limit(limit)
      .offset(offset),

    db
      .select({
        total: sql`COUNT(*)`.mapWith(Number),
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
