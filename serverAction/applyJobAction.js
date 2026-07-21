"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  applications,
  applicantMetadata,
  aiEvaluations,
  jobs,
} from "@/lib/schema";

import { authorize } from "@/lib/authorization";
import { downloadPdf, extractPdfText } from "@/lib/pdf";
import { evaluateCandidate } from "@/lib/evaluateCandidate";

export async function applyJobAction({ jobId, resumeUrl }) {
  try {
    const auth = await authorize();

    if (!auth.success) {
      return auth;
    }

    const candidateId = auth.user.id;

    if (!resumeUrl) {
      return {
        success: false,
        message: "Resume upload failed.",
      };
    }

    // --------------------------------------------------
    // Verify Job
    // --------------------------------------------------

    const [job] = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        requirements: jobs.requirements,
        status: jobs.status,
      })
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job) {
      return {
        success: false,
        message: "Job not found.",
      };
    }

    if (job.status !== "PUBLISHED") {
      return {
        success: false,
        message: "This job is no longer accepting applications.",
      };
    }

    // --------------------------------------------------
    // Duplicate Check
    // --------------------------------------------------

    const [existingApplication] = await db
      .select({
        id: applications.id,
      })
      .from(applications)
      .where(
        and(
          eq(applications.jobId, jobId),
          eq(applications.candidateId, candidateId),
        ),
      )
      .limit(1);

    if (existingApplication) {
      return {
        success: false,
        message: "You have already applied for this job.",
      };
    }

    // --------------------------------------------------
    // Resume Parsing
    // --------------------------------------------------

    const buffer = await downloadPdf(resumeUrl);

    const resumeText = await extractPdfText(buffer);

    // --------------------------------------------------
    // AI Evaluation
    // --------------------------------------------------

    const evaluation = await evaluateCandidate({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      resumeText,
    });

    // --------------------------------------------------
    // Save Everything
    // --------------------------------------------------

    const application = await db.transaction(async (tx) => {
      // Application

      const [newApplication] = await tx
        .insert(applications)
        .values({
          jobId,
          candidateId,
          resumeUrl,
          resumeText,
        })
        .returning();

      // Metadata

      await tx.insert(applicantMetadata).values({
        applicationId: newApplication.id,
        firstName: evaluation.metadata.firstName,
        lastName: evaluation.metadata.lastName,
        email: evaluation.metadata.email,
      });

      // AI Evaluation

      await tx.insert(aiEvaluations).values({
        applicationId: newApplication.id,
        overallScore: evaluation.overallScore,
        summary: evaluation.summary,
        rubrics: evaluation.rubrics,
        createdBy: auth.user.id,
      });

      return newApplication;
    });

    return {
      success: true,
      message: "Application submitted successfully.",
      data: application,
    };
  } catch (error) {
    console.error("Application submission failed:", error);

    return {
      success: false,
      message: "Something went wrong while submitting your application.",
    };
  }
}
