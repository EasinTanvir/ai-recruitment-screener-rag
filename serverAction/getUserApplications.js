"use server";

import { db } from "@/lib/db";
import { applications, jobs, aiEvaluations } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

export async function getUserApplications(userId) {
  return await db
    .select({
      applicationId: applications.id,

      jobId: jobs.id,

      jobTitle: jobs.title,

      companyName: jobs.companyName,

      status: applications.status,

      appliedAt: applications.createdAt,

      overallScore: aiEvaluations.overallScore,
    })
    .from(applications)
    .leftJoin(jobs, eq(jobs.id, applications.jobId))
    .leftJoin(aiEvaluations, eq(aiEvaluations.applicationId, applications.id))
    .where(eq(applications.candidateId, userId))
    .orderBy(desc(applications.createdAt));
}
