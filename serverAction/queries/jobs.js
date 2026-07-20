import { db } from "@/lib/db";
import {
  aiEvaluations,
  applicantMetadata,
  applications,
  jobs,
} from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

export async function getJobs() {
  return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
}
export async function getJobById(id) {
  const jobId = Number(id);

  const [job] = await db.select().from(jobs).where(eq(jobs.id, jobId));

  if (!job) {
    return null;
  }

  const applicants = await db
    .select({
      id: applications.id,
      status: applications.status,
      createdAt: applications.createdAt,

      firstName: applicantMetadata.firstName,
      lastName: applicantMetadata.lastName,
      email: applicantMetadata.email,

      overallScore: aiEvaluations.overallScore,
    })
    .from(applications)
    .leftJoin(
      applicantMetadata,
      eq(applications.id, applicantMetadata.applicationId),
    )
    .leftJoin(aiEvaluations, eq(applications.id, aiEvaluations.applicationId))
    .where(eq(applications.jobId, jobId))
    .orderBy(desc(aiEvaluations.overallScore));

  return {
    ...job,
    applicants,
  };
}
