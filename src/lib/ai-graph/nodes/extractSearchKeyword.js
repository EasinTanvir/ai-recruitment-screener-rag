import { z } from "zod";
import { structuredModel } from "../lib/models";
import { getLastHumanText } from "../lib/helpers";
import { safeStructured } from "../lib/safeInvoke";

const KeywordSchema = z.object({
  hasKeyword: z.boolean(),
  keyword: z.string().nullable(),
});

const extractor = structuredModel.withStructuredOutput(KeywordSchema, {
  name: "search_keyword",
  method: "functionCalling",
});

const SYSTEM = `The user is talking to a job-search assistant. Look at their
latest message. If they mention a specific job title, role, technology or
skill (e.g. "frontend developer", "React jobs", "something in marketing"),
set hasKeyword true and extract the shortest clean search term as keyword.
If they only vaguely say they want a job / are job hunting without naming
any kind of role (e.g. "I am looking for a job", "any jobs available?",
"help me find work"), set hasKeyword false and keyword null. Do not guess a
role they didn't mention.`;

export async function extractSearchKeyword(state) {
  const text = getLastHumanText(state.messages);

  const result = await safeStructured(
    extractor,
    [
      { role: "system", content: SYSTEM },
      { role: "user", content: text },
    ],
    { hasKeyword: false, keyword: null }, // fail-safe: ask, never guess-search
    "extractSearchKeyword",
  );

  return { searchKeyword: result.hasKeyword ? result.keyword : null };
}
