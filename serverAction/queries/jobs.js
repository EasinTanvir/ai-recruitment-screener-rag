import { db } from "@/lib/db";
import { jobs } from "@/lib/schema";
import { desc } from "drizzle-orm";

export async function getJobs() {
  return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
}
