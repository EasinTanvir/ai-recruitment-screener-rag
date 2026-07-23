"use server";

import llm from "@/lib/langchain";

import { requirementsPrompt } from "@/lib/ai/prompts/requirements";
import { descriptionPrompt } from "@/lib/ai/prompts/description";

export async function generateContentAction(data) {
  try {
    const { type, title, companyName, description, prompt } = data;

    let finalPrompt = "";

    switch (type) {
      case "description":
        finalPrompt = descriptionPrompt({
          title,
          companyName,
          instructions: prompt,
        });
        break;

      case "requirements":
        finalPrompt = requirementsPrompt({
          title,
          companyName,
          description,
          instructions: prompt,
        });
        break;

      default:
        return {
          success: false,
          message: "Invalid generation type.",
        };
    }

    const response = await llm.invoke(finalPrompt);

    return {
      success: true,
      message: response.content,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Failed to generate content.",
    };
  }
}
