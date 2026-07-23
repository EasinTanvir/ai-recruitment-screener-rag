"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

import { applications } from "@/lib/schema";

import { sendCandidateEmail } from "@/lib/mailService";
import { getApplicantById } from "./queries/applications";

const schema = z.object({
  applicationId: z.number(),
  message: z.string().trim().min(10),
});

export async function scheduleMeetingAction(values) {
  try {
    const { applicationId, message } = schema.parse(values);

    const application = await getApplicantById(applicationId);

    if (!application) {
      return {
        success: false,
        message: "Application not found.",
      };
    }

    const emailResult = await sendCandidateEmail({
      email: application.email,
      firstName: application.firstName,
      jobTitle: application.jobTitle,
      message,
    });

    if (!emailResult.success) {
      return {
        success: false,
        message: "Failed to send email.",
      };
    }

    await db
      .update(applications)
      .set({
        status: "SHORTLISTED",
        updatedAt: new Date(),
      })
      .where(eq(applications.id, applicationId));

    revalidatePath("/dashboard/jobs");

    return {
      success: true,
      message: "Interview invitation sent successfully.",
    };
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.issues[0].message,
      };
    }

    return {
      success: false,
      message: "Something went wrong.",
    };
  }
}
