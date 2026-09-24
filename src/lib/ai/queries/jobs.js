import { db } from "@/lib/db";
import { jobs } from "@/lib/schema";
import { ilike, and, eq, or, sql, desc } from "drizzle-orm";

export async function searchJobsByTitle(title) {
  const words = title
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2);

  if (!words.length) return [];

  // one (title ILIKE '%word%')::int per word, summed → match_score
  const matchScore = sql`(${sql.join(
    words.map((w) => sql`(${jobs.title} ILIKE ${`%${w}%`})::int`),
    sql` + `,
  )})`;

  return await db
    .select({
      id: jobs.id,
      title: jobs.title,
      companyName: jobs.companyName,
      matchScore,
    })
    .from(jobs)
    .where(
      and(
        eq(jobs.status, "PUBLISHED"),
        or(...words.map((w) => ilike(jobs.title, `%${w}%`))),
      ),
    )
    .orderBy(desc(matchScore))
    .limit(4);
}
