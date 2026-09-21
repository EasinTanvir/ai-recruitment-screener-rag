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

const ROLE_PATTERNS = [
  /\bfull[\s-]?stack\s+(?:engineer|developer)\b/gi,
  /\b(?:front[\s-]?end|frontend)\s+(?:engineer|developer)\b/gi,
  /\b(?:back[\s-]?end|backend)\s+(?:engineer|developer)\b/gi,
  /\bmern\s+(?:stack\s+)?developer\b/gi,
  /\b(?:devops|database|software|python|java|mobile)\s+(?:engineer|developer)\b/gi,
];

const SKILL_SEARCH_TERMS = [
  "React",
  "Next.js",
  "Node.js",
  "Python",
  "Java",
  "DevOps",
  "Database",
  "AWS",
  "Docker",
];

function uniqueTerms(terms) {
  return [...new Set(terms.filter(Boolean).map((term) => term.trim()))];
}

// The profile model is useful enrichment, but it must not be the only way a
// CV can start a search. Tool-call parsing can occasionally fail even when
// the PDF text is perfectly readable, so derive searchable terms locally too.
function extractCvSearchTerms(resumeText) {
  const terms = [];

  for (const pattern of ROLE_PATTERNS) {
    for (const match of resumeText.matchAll(pattern)) {
      const role = match[0].replace(/\s+/g, " ").trim();
      if (/^full[\s-]?stack/i.test(role)) terms.push("Full Stack");
      else if (/^mern/i.test(role)) terms.push("MERN");
      else terms.push(role.replace(/\s+(engineer|developer)$/i, ""));
    }
  }

  for (const skill of SKILL_SEARCH_TERMS) {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`\\b${escaped}\\b`, "i").test(resumeText)) {
      terms.push(skill);
    }
  }

  return uniqueTerms(terms);
}

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
  const fallbackSearchTerms = extractCvSearchTerms(resumeText);
  const fallbackProfile = {
    firstName: null,
    lastName: null,
    email: extractEmailFallback(resumeText),
    title: fallbackSearchTerms[0] ?? "",
    skills: fallbackSearchTerms.slice(1),
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
    cvProfile: {
      ...cvProfile,
      // Keep LLM-extracted detail while guaranteeing terms for a CV-driven
      // search when the structured result was partial or used a different
      // spelling than the job title.
      searchTerms: uniqueTerms([
        cvProfile.title,
        ...(cvProfile.skills ?? []),
        ...fallbackSearchTerms,
      ]),
    },
    incomingResumeUrl: null,
    cvParseError: null,
  };
}
