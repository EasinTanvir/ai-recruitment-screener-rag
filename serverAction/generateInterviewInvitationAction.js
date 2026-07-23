"use server";

import { interviewInvitationPrompt } from "@/lib/ai/prompts/interviewInvitation";
import llm from "@/lib/langchain";

export async function generateInterviewInvitationAction({
  candidateName,
  jobTitle,
  additionalInstructions = "",
}) {
  try {
    const prompt = interviewInvitationPrompt({
      candidateName,
      jobTitle,
      additionalInstructions,
    });

    const response = await llm.invoke(prompt);

    return {
      success: true,
      message: "Invitation generated successfully.",
      data: response.content.trim(),
    };
  } catch (error) {
    console.error("generateInterviewInvitationAction:", error);

    return {
      success: false,
      message: "Failed to generate interview invitation.",
    };
  }
}
