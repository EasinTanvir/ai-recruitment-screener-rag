import { tool } from "@langchain/core/tools";
import { z } from "zod";

import { getCompanyOverview } from "../rag/loadKnowledge";

export const companyKnowledgeTool = tool(
  async () => {
    const knowledge = await getCompanyOverview();

    return {
      source: "company-overview",
      content: knowledge,
    };
  },
  {
    name: "company_knowledge",

    description:
      "Use this tool whenever the user asks about HireFlow, the company, office location, products, mission, employees, workplace, policies, culture, or other company information.",

    schema: z.object({}),
  },
);
