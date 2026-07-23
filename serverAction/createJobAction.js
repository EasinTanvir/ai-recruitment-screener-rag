"use server";

import { db } from "@/lib/db";
import { jobs } from "@/lib/schema";
import { revalidatePath } from "next/cache";
import { authorize } from "@/lib/authorization";
import llm from "@/lib/langchain";
export async function createJobAction(data) {
  try {
    const auth = await authorize("ADMIN");

    if (!auth.success) {
      return auth;
    }

    const { user } = auth;

    const { title, companyName, description, requirements } = data;

    if (!title || !companyName || !description || !requirements) {
      return {
        success: false,
        message: "All fields are required.",
      };
    }

    await db.insert(jobs).values({
      title,
      companyName,
      description,
      requirements,
      createdBy: user.id,
    });

    revalidatePath("/dashboard/jobs");

    return {
      success: true,
      message: "Job created successfully.",
    };
  } catch (error) {
    console.error("errors", error);

    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
