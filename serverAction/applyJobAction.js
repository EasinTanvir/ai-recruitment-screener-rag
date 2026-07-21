"use server";

import { authorize } from "@/lib/authorization";
import { extractPdfText } from "@/lib/pdf";

export async function applyJobAction({ jobId, resumeUrl }) {
  try {
    const auth = await authorize();

    if (!auth.success) {
      return auth;
    }

    const resumeText = await extractPdfText(resumeUrl);

    console.log(resumeText);

    return {
      success: true,
      message: "Resume parsed successfully.",
    };
  } catch (error) {
    console.error("failed to parse", error);

    return {
      success: false,
      message: "Something went wrong.",
    };
  }
}
