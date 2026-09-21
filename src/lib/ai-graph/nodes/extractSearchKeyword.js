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
role they didn't mention.

When you want to draw attention to something, wrap ONLY the specific phrase 
(never a whole sentence) in one of these markers:

- :danger[...]   → blocking errors / failures        (red)
- :warn[...]     → a required action before continuing, e.g. login  (amber)
- :success[...]  → confirmations, e.g. application submitted        (green)
- :info[...]     → a neutral callout worth noticing                 (blue)
- :highlight[...]→ emphasize one key term                           (yellow)

Example:
"You can browse jobs without an account, but :warn[you'll need to log in] 
before uploading your CV."

Use normal markdown (##, **, -, numbered lists) for everything else.
Use these sparingly — a few words, not paragraphs.
`;

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
