// tools/searchJobsTool.js
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { searchJobsByTitle } from "@/lib/ai/queries/jobs";

export const searchJobsTool = tool(
  async ({ keyword }) => {
    const jobs = await searchJobsByTitle(keyword);

    if (!jobs.length) {
      return `No open jobs matched "${keyword}". Suggest the user try a different title or a broader skill.`;
    }

    return JSON.stringify(
      jobs.map((j) => ({
        id: j.id,
        title: j.title,
        companyName: j.companyName,
      })),
    );
  },
  {
    name: "search_jobs",
    description:
      "Search open job listings by title, role, or skill keyword (e.g. 'frontend developer', 'React', 'marketing'). Only call this when the user names a role/skill. If they're vague ('I want a job', 'any openings?'), don't call this — ask them to clarify instead.",
    schema: z.object({
      keyword: z.string().describe("job title, role, or skill to search for"),
    }),
  },
);
