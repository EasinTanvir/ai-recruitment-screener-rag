import { z } from "zod";
import { downloadPdf, extractPdfText } from "@/lib/pdf";
import { structuredModel } from "../lib/models";
import { reply, extractEmailFallback } from "../lib/helpers";
import { safeStructured } from "../lib/safeInvoke";

const CvProfileSchema = z.object({
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.string().nullable(),
  title: z
    .string()
    .describe(
      "Best-fit job title for this candidate, e.g. 'Frontend Developer'",
    ),
  skills: z.array(z.string()).default([]),
  yearsExperience: z.number().nullable(),
});

const extractor = structuredModel.withStructuredOutput(CvProfileSchema, {
  name: "cv_profile",
  method: "functionCalling",
});

export async function handleCvUpload(state) {
  // ---- step 1: download + extract raw text — a real failure here means
  // we genuinely can't read the file, so it's fair to stop and tell the user ----
  let resumeText;
  try {
    const buffer = await downloadPdf(state.incomingResumeUrl);
    resumeText = await extractPdfText(buffer);
  } catch (err) {
    console.error("CV download/text-extraction failed:", err);
    return {
      incomingResumeUrl: null,
      cvParseError: "unreadable",
      ...reply(
        "I couldn't read that CV — please make sure it's a valid PDF and try uploading again.",
      ),
    };
  }

  // ---- step 2: structured profile extraction — a failure here is NOT a
  // "bad PDF", it's the LLM call. Degrade gracefully instead of blocking. ----
  const fallbackProfile = {
    firstName: null,
    lastName: null,
    email: extractEmailFallback(resumeText),
    title: "",
    skills: [],
    yearsExperience: null,
  };

  const cvProfile = await safeStructured(
    extractor,
    [
      {
        role: "system",
        content:
          "Extract candidate profile fields from this resume text. " +
          "If a field isn't present, use null (skills defaults to []).",
      },
      { role: "user", content: resumeText.slice(0, 12000) },
    ],
    fallbackProfile,
    "handleCvUpload:extractProfile",
  );

  return {
    resumeUrl: state.incomingResumeUrl,
    resumeText,
    cvProfile,
    incomingResumeUrl: null,
    cvParseError: null,
  };
}
