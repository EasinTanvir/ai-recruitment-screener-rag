const WEIGHTS = {
  "Technical Skills": 0.35,
  Experience: 0.25,
  Projects: 0.15,
  Education: 0.1,
  "Domain Knowledge": 0.1,
  Communication: 0.03,
  Leadership: 0.02,
};

export function calculateOverallScore(rubrics) {
  let score = 0;

  for (const rubric of rubrics) {
    const weight = WEIGHTS[rubric.rubricName] ?? 0;

    score += (rubric.score / 5) * 100 * weight;
  }

  return Math.round(score);
}
