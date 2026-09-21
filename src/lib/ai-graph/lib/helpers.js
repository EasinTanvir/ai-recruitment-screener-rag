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

export function resolveJobFromText(text, jobs = []) {
  if (!jobs.length) return null;
  const lower = text.toLowerCase();

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

  const byId = jobs.find((j) => lower.includes(String(j.id)));
  if (byId) return byId;

  return null;
}
