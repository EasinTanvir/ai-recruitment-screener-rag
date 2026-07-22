import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { searchJobsByTitle } from "../queries/jobs";

export const searchJobsTool = tool(
  async ({ title }) => {
    const jobs = await searchJobsByTitle(title);

    return {
      found: jobs.length > 0,
      jobs,
    };
  },
  {
    name: "search_jobs",

    description:
      "Search published jobs by job title. Use this whenever the user asks about available jobs, careers, openings or roles.",

    schema: z.object({
      title: z.string().describe("Job title or keyword"),
    }),
  },
);
