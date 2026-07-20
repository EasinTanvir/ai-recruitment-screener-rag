import { db } from "@/lib/db";
import { jobs } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";

export async function getJobs() {
  return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
}

export async function getJobById(id) {
  const [job] = await db
    .select()
    .from(jobs)
    .where(eq(jobs.id, Number(id)));

  return job;
}
