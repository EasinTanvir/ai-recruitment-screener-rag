import { z } from "zod";
import { downloadPdf, extractPdfText } from "@/lib/pdf";
import { structuredModel } from "../lib/models";
import { reply } from "../lib/helpers";

const CvProfileSchema = z.object({
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().nullable(),
  title: z.string().describe("Best-fit job title for this candidate, e.g. 'Frontend Developer'"),
  skills: z.array(z.string()).default([]),
  yearsExperience: z.number().nullable(),
});

const extractor = structuredModel.withStructuredOutput(CvProfileSchema, {
  name: "cv_profile",
});

/**
 * Parses the just-uploaded CV (state.incomingResumeUrl) into resumeText +
 * a structured profile, and clears incomingResumeUrl so it isn't
 * reprocessed on the next turn.
 */
export async function handleCvUpload(state) {
  try {
    const buffer = await downloadPdf(state.incomingResumeUrl);
    const resumeText = await extractPdfText(buffer);

    const cvProfile = await extractor.invoke([
      {
        role: "system",
        content:
          "Extract candidate profile fields from this resume text. " +
          "If a field isn't present, use null (skills defaults to []).",
      },
      { role: "user", content: resumeText.slice(0, 12000) },
    ]);

    return {
      resumeUrl: state.incomingResumeUrl,
      resumeText,
      cvProfile,
      incomingResumeUrl: null,
      cvParseError: null,
    };
  } catch (err) {
    console.error("CV parsing failed:", err);
    return {
      incomingResumeUrl: null,
      cvParseError: "unreadable",
      ...reply(
        "I couldn't read that CV — please make sure it's a valid PDF and try uploading again.",
      ),
    };
  }
}
