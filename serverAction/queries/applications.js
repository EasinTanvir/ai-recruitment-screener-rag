// lib/queries/applications.js
import { eq, desc, sql, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { applications, applicantMetadata, aiEvaluations } from "@/lib/schema";

// lib/queries/jobs.js (add this alongside getJobById)
export async function getApplicantById(applicationId) {
  const id = Number(applicationId);

  const [application] = await db
    .select({
      id: applications.id,
      status: applications.status,
      createdAt: applications.createdAt,
      resumeUrl: applications.resumeUrl,

      firstName: applicantMetadata.firstName,
      lastName: applicantMetadata.lastName,
      email: applicantMetadata.email,

      overallScore: aiEvaluations.overallScore,
      summary: aiEvaluations.summary,
      rubrics: aiEvaluations.rubrics,

      evaluationId: aiEvaluations.id,
      evaluationCreatedAt: aiEvaluations.createdAt,
    })
    .from(applications)
    .leftJoin(
      applicantMetadata,
      eq(applicantMetadata.applicationId, applications.id),
    )
    .leftJoin(aiEvaluations, eq(aiEvaluations.applicationId, applications.id))
    .where(eq(applications.id, id))
    .orderBy(desc(aiEvaluations.createdAt))
    .limit(1);

  if (!application) return null;

  return application;
}

export async function getApplicantsByJobId(jobId) {
  return await db
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
      eq(applicantMetadata.applicationId, applications.id),
    )
    .leftJoin(aiEvaluations, eq(aiEvaluations.applicationId, applications.id))
    .where(eq(applications.jobId, Number(jobId)))
    .orderBy(desc(applications.createdAt));
}
