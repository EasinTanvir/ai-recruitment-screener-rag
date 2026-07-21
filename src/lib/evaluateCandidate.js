import llm from "./langchain";
import { parseEvaluation } from "./parseEvaluation";
import { buildEvaluationPrompt } from "./prompt";
import { calculateOverallScore } from "./score";

export async function evaluateCandidate({
  title,
  description,
  requirements,
  resumeText,
}) {
  const prompt = buildEvaluationPrompt({
    title,
    description,
    requirements,
    resumeText,
  });

  const response = await llm.invoke(prompt);
  console.log("response from llm", response);
  const result = parseEvaluation(response.content);

  return {
    metadata: result.metadata,
    summary: result.summary,
    rubrics: result.rubrics,
    overallScore: calculateOverallScore(result.rubrics),
  };
}
