"use server";

import { and, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { applications, jobs } from "@/lib/schema";
import { authorize } from "@/lib/authorization";
import { downloadPdf, extractPdfText } from "@/lib/pdf";

export async function applyJobAction({ jobId, resumeUrl }) {
  try {
    const auth = await authorize();

    if (!auth.success) {
      return auth;
    }

    const candidateId = auth.user.id;

    // Verify job exists
    const [job] = await db
      .select({
        id: jobs.id,
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

    // Prevent duplicate applications
    const [existingApplication] = await db
      .select({ id: applications.id })
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

    // Download & parse resume
    const buffer = await downloadPdf(resumeUrl);
    const resumeText = await extractPdfText(buffer);

    // Save application
    const [application] = await db
      .insert(applications)
      .values({
        jobId,
        candidateId,
        resumeUrl,
        resumeText,
      })
      .returning();

    return {
      success: true,
      message: "Application submitted successfully.",
      data: application,
    };
  } catch (error) {
    console.error("Failed to submit application:", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
