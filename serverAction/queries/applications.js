// lib/queries/applications.js
import { eq, desc, sql, and } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  applications,
  applicantMetadata,
  aiEvaluations,
  jobs,
} from "@/lib/schema";

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

export async function getApplicantById(applicationId) {
  const id = Number(applicationId);

  const rows = await db
    .select({
      applicationId: applications.id,
      status: applications.status,
      createdAt: applications.createdAt,
      resumeUrl: applications.resumeUrl,

      jobTitle: jobs.title,

      firstName: applicantMetadata.firstName,
      lastName: applicantMetadata.lastName,
      email: applicantMetadata.email,

      evaluationId: aiEvaluations.id,
      overallScore: aiEvaluations.overallScore,
      summary: aiEvaluations.summary,
      rubrics: aiEvaluations.rubrics,
      evaluatedAt: aiEvaluations.createdAt,
    })
    .from(applications)
    .leftJoin(jobs, eq(jobs.id, applications.jobId))
    .leftJoin(
      applicantMetadata,
      eq(applicantMetadata.applicationId, applications.id),
    )
    .leftJoin(aiEvaluations, eq(aiEvaluations.applicationId, applications.id))
    .where(eq(applications.id, id))
    .orderBy(desc(aiEvaluations.createdAt));

  if (rows.length === 0) {
    return null;
  }

  const latest = rows[0];

  return {
    id: latest.applicationId,
    status: latest.status,
    createdAt: latest.createdAt,
    resumeUrl: latest.resumeUrl,

    jobTitle: latest.jobTitle,

    firstName: latest.firstName,
    lastName: latest.lastName,
    email: latest.email,

    latestEvaluation: latest.evaluationId
      ? {
          id: latest.evaluationId,
          overallScore: latest.overallScore,
          summary: latest.summary,
          rubrics: latest.rubrics,
          createdAt: latest.evaluatedAt,
        }
      : null,

    evaluationHistory: rows
      .filter((row) => row.evaluationId)
      .map((row) => ({
        id: row.evaluationId,
        overallScore: row.overallScore,
        summary: row.summary,
        rubrics: row.rubrics,
        createdAt: row.evaluatedAt,
      })),
  };
}
