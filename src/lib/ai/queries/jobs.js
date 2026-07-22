import { db } from "@/lib/db";
import { jobs } from "@/lib/schema";
import { ilike, and, eq } from "drizzle-orm";

export async function searchJobsByTitle(title) {
  return await db
    .select({
      id: jobs.id,
      title: jobs.title,
      companyName: jobs.companyName,
    })
    .from(jobs)
    .where(and(ilike(jobs.title, `%${title}%`), eq(jobs.status, "PUBLISHED")));
}
