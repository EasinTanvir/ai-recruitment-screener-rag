import { db } from "@/lib/db";
import { aiEvaluations, applications, jobs, users } from "@/lib/schema";

import { desc, eq, sql } from "drizzle-orm";

export async function getDashboardData() {
  const [metrics, recentJobs, recentApplications] = await Promise.all([
    getMetrics(),
    getRecentJobs(),
    getRecentApplications(),
  ]);

  return {
    metrics,
    recentJobs,
    recentApplications,
  };
}

async function getMetrics() {
  const [totalJobs, publishedJobs, draftJobs, totalApplications] =
    await Promise.all([
      db
        .select({
          count: sql`count(*)`,
        })
        .from(jobs),

      db
        .select({
          count: sql`count(*)`,
        })
        .from(jobs)
        .where(eq(jobs.status, "PUBLISHED")),

      db
        .select({
          count: sql`count(*)`,
        })
        .from(jobs)
        .where(eq(jobs.status, "DRAFT")),

      db
        .select({
          count: sql`count(*)`,
        })
        .from(applications),
    ]);

  return [
    {
      title: "Total Jobs",
      value: Number(totalJobs[0].count),
    },
    {
      title: "Published Jobs",
      value: Number(publishedJobs[0].count),
    },
    {
      title: "Draft Jobs",
      value: Number(draftJobs[0].count),
    },
    {
      title: "Applications",
      value: Number(totalApplications[0].count),
    },
  ];
}

async function getRecentJobs() {
  const result = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      status: jobs.status,
      publishedAt: jobs.publishedAt,
    })
    .from(jobs)
    .orderBy(desc(jobs.createdAt))
    .limit(5);

  return result.map((job) => ({
    ...job,
    applicants: 0,
    publishedDate: job.publishedAt
      ? new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(job.publishedAt)
      : "Draft",
  }));
}

async function getRecentApplications() {
  return db
    .select({
      id: applications.id,
      candidate: users.name,
      job: jobs.title,
      score: aiEvaluations.overallScore,
      status: applications.status,
      createdAt: applications.createdAt,
    })
    .from(applications)
    .innerJoin(users, eq(applications.candidateId, users.id))
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .leftJoin(aiEvaluations, eq(aiEvaluations.applicationId, applications.id))
    .orderBy(desc(applications.createdAt))
    .limit(5);
}
