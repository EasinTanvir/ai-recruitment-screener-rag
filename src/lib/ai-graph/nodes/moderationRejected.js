// nodes/moderationRejected.js
import { reply } from "../lib/helpers";
export async function moderationRejected() {
  return reply(
    "I can't help with that here. I'm the recruiting assistant for this site — tell me what role you're looking for, or upload your CV.",
  );
}
