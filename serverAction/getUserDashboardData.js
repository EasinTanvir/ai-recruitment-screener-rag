"use server";

import { db } from "@/lib/db";
import { applications } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

export async function getUserDashboardData(userId) {
  const [summary] = await db
    .select({
      totalApplications: sql`count(*)`,

      pending: sql`
        count(*) filter (
          where ${applications.status} = 'PENDING'
        )
      `,

      underReview: sql`
        count(*) filter (
          where ${applications.status} = 'UNDER_REVIEW'
        )
      `,

      shortlisted: sql`
        count(*) filter (
          where ${applications.status} = 'SHORTLISTED'
        )
      `,

      interview: sql`
        count(*) filter (
          where ${applications.status} = 'INTERVIEW'
        )
      `,

      accepted: sql`
        count(*) filter (
          where ${applications.status} = 'ACCEPTED'
        )
      `,

      rejected: sql`
        count(*) filter (
          where ${applications.status} = 'REJECTED'
        )
      `,
    })
    .from(applications)
    .where(eq(applications.candidateId, userId));

  return summary;
}
