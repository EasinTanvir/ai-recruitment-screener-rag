import { HumanMessage, AIMessage } from "@langchain/core/messages";

// Keep enough recent turns for references such as "the other one", while
// still keeping prompts bounded as a conversation becomes long.
export const CONTEXT_WINDOW = 15;

export function getLastHumanText(messages = []) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m instanceof HumanMessage || m._getType?.() === "human") {
      return typeof m.content === "string" ? m.content : "";
    }
  }
  return "";
}

export function reply(text) {
  return { messages: [new AIMessage(text)] };
}

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
export function extractEmailFallback(text) {
  const match = text.match(EMAIL_RE);
  return match ? match[0] : null;
}

// Very cheap ordinal/title matcher so "apply to the 2nd one" or
// "I want the Frontend Developer role" both resolve without an LLM call.
const ORDINALS = [
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
];

const REFERENCE_WORDS = new Set([
  "apply",
  "application",
  "for",
  "i",
  "to",
  "want",
  "would",
  "like",
  "this",
  "that",
  "the",
  "a",
  "an",
  "job",
  "role",
  "position",
  "post",
  "posting",
  "one",
  "it",
]);

function titleTokens(value) {
  return value
    .toLowerCase()
    .replace(/fullstack/g, "full stack")
    .match(/[a-z0-9+#.]+/g)
    ?.filter((token) => !REFERENCE_WORDS.has(token)) ?? [];
}

function tokenMatches(a, b) {
  return a === b || (a.length >= 4 && b.length >= 4 && (a.startsWith(b) || b.startsWith(a)));
}

export function resolveJobFromText(text, jobs = []) {
  if (!jobs.length) return null;
  const lower = text.toLowerCase();

  // When exactly one result is in view, references such as "this position"
  // are unambiguous. Do this before title matching so users need not repeat it.
  if (jobs.length === 1 && /\b(this|that|it|one|position|role|job|post)\b/.test(lower)) {
    return jobs[0];
  }

  const numMatch = lower.match(/\b([1-9])(st|nd|rd|th)?\b/);
  if (numMatch) {
    const idx = parseInt(numMatch[1], 10) - 1;
    if (jobs[idx]) return jobs[idx];
  }

  for (let i = 0; i < ORDINALS.length; i++) {
    if (lower.includes(ORDINALS[i])) {
      const idx = i % 5;
      if (jobs[idx]) return jobs[idx];
    }
  }

  const byTitle = jobs.find(
    (j) =>
      lower.includes(j.title.toLowerCase()) ||
      j.title.toLowerCase().includes(lower.trim()),
  );
  if (byTitle) return byTitle;

  // Users commonly shorten a displayed title ("MERN developer" instead of
  // "MERN Full Stack Developer"). Select a title only when its token overlap
  // is clearly better than every other visible result.
  const referenceTokens = titleTokens(text);
  if (referenceTokens.length) {
    const scored = jobs
      .map((job) => ({
        job,
        score: titleTokens(job.title).reduce(
          (total, token) =>
            total + (referenceTokens.some((reference) => tokenMatches(token, reference)) ? 1 : 0),
          0,
        ),
      }))
      .sort((a, b) => b.score - a.score);

    if (scored[0].score > 0 && scored[0].score > (scored[1]?.score ?? 0)) {
      return scored[0].job;
    }
  }

  const byId = jobs.find((j) => lower.includes(String(j.id)));
  if (byId) return byId;

  return null;
}
