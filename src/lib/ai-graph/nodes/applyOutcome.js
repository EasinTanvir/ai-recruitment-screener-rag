import { db } from "@/lib/db";
import { applications, applicantMetadata, aiEvaluations } from "@/lib/schema";
import { and, eq } from "drizzle-orm";
import { evaluateCandidate } from "@/lib/evaluateCandidate";
import { getJobByIdFull } from "../lib/jobQueries";
import { reply } from "../lib/helpers";

export async function applyJobNode(state) {
  const jobId = state.selectedJobId;
  const candidateId = state.userId;

  const job = await getJobByIdFull(jobId);
  if (!job) {
    return { pendingApplyJobId: null, ...reply("That job is no longer available.") };
  }

  const [existing] = await db
    .select({ id: applications.id })
    .from(applications)
    .where(and(eq(applications.jobId, jobId), eq(applications.candidateId, candidateId)))
    .limit(1);

  if (existing) {
    return {
      pendingApplyJobId: null,
      ...reply(`You've already applied for **${job.title}** — no need to do it twice!`),
    };
  }

  try {
    const evaluation = await evaluateCandidate({
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      resumeText: state.resumeText,
    });

    await db.transaction(async (tx) => {
      const [newApplication] = await tx
        .insert(applications)
        .values({
          jobId,
          candidateId,
          resumeUrl: state.resumeUrl,
          resumeText: state.resumeText,
        })
        .returning();

      await tx.insert(applicantMetadata).values({
        applicationId: newApplication.id,
        firstName: evaluation.metadata.firstName,
        lastName: evaluation.metadata.lastName,
        email: evaluation.metadata.email,
      });

      await tx.insert(aiEvaluations).values({
        applicationId: newApplication.id,
        overallScore: evaluation.overallScore,
        summary: evaluation.summary,
        rubrics: evaluation.rubrics,
        createdBy: candidateId,
      });
    });

    return {
      pendingApplyJobId: null,
      selectedJobId: null,
      ...reply(`✅ Application submitted for **${job.title}** at ${job.companyName}. Good luck!`),
    };
  } catch (err) {
    console.error("Chatbot apply failed:", err);
    return {
      ...reply("Something went wrong while submitting your application. Please try again in a moment."),
    };
  }
}

export async function cancelNode(state) {
  return {
    pendingApplyJobId: null,
    selectedJobId: null,
    ...reply("No problem — application cancelled. Let me know if you'd like to look at other roles."),
  };
}
