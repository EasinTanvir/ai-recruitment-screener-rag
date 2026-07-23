import fs from "fs/promises";
import path from "path";

let companyOverviewCache = null;

export async function getCompanyOverview() {
  if (companyOverviewCache) {
    return companyOverviewCache;
  }

  const filePath = path.join(process.cwd(), "rag", "company-overview.md");

  companyOverviewCache = await fs.readFile(filePath, "utf8");

  return companyOverviewCache;
}
