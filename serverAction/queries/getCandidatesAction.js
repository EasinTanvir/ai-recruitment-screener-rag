"use server";

import { db } from "@/lib/db";
import {
  applications,
  applicantMetadata,
  aiEvaluations,
  jobs,
} from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

export async function getCandidatesAction() {
  try {
    const data = await db
      .select({
        applicationId: applications.id,

        candidateId: applications.candidateId,

        firstName: applicantMetadata.firstName,
        lastName: applicantMetadata.lastName,
        email: applicantMetadata.email,

        jobTitle: jobs.title,

        status: applications.status,

        overallScore: aiEvaluations.overallScore,

        appliedAt: applications.createdAt,

        resumeUrl: applications.resumeUrl,
      })
      .from(applications)
      .leftJoin(
        applicantMetadata,
        eq(applicantMetadata.applicationId, applications.id),
      )
      .leftJoin(jobs, eq(jobs.id, applications.jobId))
      .leftJoin(aiEvaluations, eq(aiEvaluations.applicationId, applications.id))
      .orderBy(desc(applications.createdAt));

    return {
      success: true,
      message: "Applications fetched successfully.",
      data,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to fetch applications.",
      data: [],
    };
  }
}
