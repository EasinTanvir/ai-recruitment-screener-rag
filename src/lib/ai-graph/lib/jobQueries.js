import { db } from "@/lib/db";
import { jobs } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

// Full-field version of the existing searchJobsByTitle, needed because CV
// scoring and the apply-confirmation step need description/requirements,
// not just title/company.
export async function getJobByIdFull(jobId) {
  const [job] = await db
    .select({
      id: jobs.id,
      title: jobs.title,
      companyName: jobs.companyName,
      description: jobs.description,
      requirements: jobs.requirements,
      status: jobs.status,
    })
    .from(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.status, "PUBLISHED")))
    .limit(1);

  return job ?? null;
}
