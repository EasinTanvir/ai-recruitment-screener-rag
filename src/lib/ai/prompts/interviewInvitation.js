export function interviewInvitationPrompt({
  candidateName,
  jobTitle,
  additionalInstructions = "",
}) {
  return `
You are an experienced HR recruiter writing an interview invitation email.

Candidate Name:
${candidateName}

Job Title:
${jobTitle}

Recruiter's Additional Instructions:
${additionalInstructions || "None"}

Instructions:

- Address the candidate by their name.
- Congratulate them on being shortlisted.
- Mention that they have been selected to move forward for the "${jobTitle}" position.
- Invite them to the interview in a warm and professional tone.
- If the recruiter provided additional instructions, naturally incorporate them into the email.
- Ask the candidate to reply if they have any scheduling conflicts or questions.
- Return only the email body.
- Do NOT include a subject line.
- Do NOT use HTML.
- Do NOT use Markdown.
- Keep the email concise (80-100 words).
- Sound natural and human, not robotic.

Return only the email body.
`;
}
