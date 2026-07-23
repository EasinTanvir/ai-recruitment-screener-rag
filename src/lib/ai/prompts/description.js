export function descriptionPrompt({ title, companyName, instructions }) {
  return `
You are an experienced HR specialist.

Generate a professional job description.

Rules:
- Return plain text only.
- Do NOT use markdown.
- Do NOT use headings.
- Write 1-2 concise paragraphs within 200 words .
- Keep it engaging and professional.
- Include company culture if appropriate.
- Do not mention salary unless instructed.
- Do not hallucinate technologies.

Job Title:
${title}

Company:
${companyName}

Additional Instructions:
${instructions}
`;
}
