import { reply } from "../lib/helpers";

export async function offtopicGuard() {
  return reply(
    "I'm the recruiting assistant for this site, so I can only help with " +
      "job search and applications here. Tell me what kind of role you're " +
      "looking for, or upload your CV and I'll match you to open positions.",
  );
}
