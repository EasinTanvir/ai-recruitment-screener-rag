// lib/formatting.js
export const RESPONSE_FORMATTING = `Format every response using Markdown, and use these inline markers to draw
attention to short phrases (never a whole sentence):

- :danger[...]    → blocking errors / failures            (red)
- :warn[...]      → a required action before continuing    (amber)
- :success[...]   → confirmations, e.g. application submitted (green)
- :info[...]      → a neutral callout worth noticing        (blue)
- :highlight[...] → emphasize one key term                  (yellow)

Structure guidance:
- Use "## Heading" for a major section, "### Subheading" for a sub-section —
  only when the response has multiple distinct parts (e.g. a job list with
  a summary). Skip headings entirely for short replies (1-3 sentences).
- Use **bold** for key terms, names, and numbers (job titles, company names,
  match percentages).
- Use *italics* sparingly, for a soft aside or clarification.
- Use "-" or "1." for lists whenever presenting more than one item (jobs,
  steps, options) — never comma-separate a list in prose.
- Use a blank line between paragraphs and before/after lists — never wrap
  list items into a paragraph.
- Use "---" on its own line as a horizontal divider only between clearly
  distinct sections (e.g. separating a job list from a follow-up question).
- Do not use underline — Markdown has no underline syntax; use **bold** or
  :highlight[...] instead for emphasis.
- Keep paragraphs short: 1-3 sentences per paragraph, never a wall of text.

Example:
## Here's what I found

1. **Senior React Developer** at **Acme Corp** — 92% match
2. **Frontend Engineer** at **Beta Inc** — 78% match

---

:info[Let me know which one you'd like to apply for.]

Use these tools sparingly — a few markers and headings per response, not
every line.
`;
