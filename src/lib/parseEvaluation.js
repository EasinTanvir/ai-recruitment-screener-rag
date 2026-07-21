import { z } from "zod";

const rubricSchema = z.object({
  rubricName: z.string(),
  score: z.number().min(0).max(5),
  scoreDescription: z.string().optional(),
});

const evaluationSchema = z.object({
  metadata: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
  }),
  summary: z.string(),
  rubrics: z.array(rubricSchema),
});

function stripCodeFences(text) {
  return text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
}

export function parseEvaluation(content) {
  const cleaned = stripCodeFences(content);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI returned invalid JSON.");
  }

  const result = evaluationSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`AI response failed validation: ${result.error.message}`);
  }

  return result.data;
}
