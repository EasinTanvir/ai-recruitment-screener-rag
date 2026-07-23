export function requirementsPrompt({
  title,
  companyName,
  description,
  instructions,
}) {
  return `
You are an experienced technical recruiter.

Generate job requirements.

Rules:

- Return plain text only.
- Do NOT use markdown.
- Generate between 6 and 8 requirements.
- Every requirement MUST start with "- " (hyphen followed by a space).
- Put exactly one requirement per line.
- Keep requirements realistic.
- Do not invent technologies that are not mentioned or implied.
- Do not include headings, numbering, or any introductory or concluding text.

Example Output:
- Strong proficiency in React.js and Next.js.
- Experience working with REST APIs.
- Familiarity with Git and collaborative development.
- Excellent problem-solving and communication skills.

Job Title:
${title}

Company:
${companyName}

Job Description:
${description}

Additional Instructions:
${instructions}
`;
}
