import { desc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { applications, applicantMetadata, aiEvaluations } from "@/lib/schema";

export async function getJobCandidates(jobId) {
  return await db
    .select({
      applicationId: applications.id,
      status: applications.status,
      appliedAt: applications.createdAt,
      resumeUrl: applications.resumeUrl,

      firstName: applicantMetadata.firstName,
      lastName: applicantMetadata.lastName,
      email: applicantMetadata.email,

      overallScore: aiEvaluations.overallScore,
    })
    .from(applications)
    .leftJoin(
      applicantMetadata,
      eq(applicantMetadata.applicationId, applications.id),
    )
    .leftJoin(aiEvaluations, eq(aiEvaluations.applicationId, applications.id))
    .where(eq(applications.jobId, Number(jobId)))
    .orderBy(desc(applications.createdAt));
}
