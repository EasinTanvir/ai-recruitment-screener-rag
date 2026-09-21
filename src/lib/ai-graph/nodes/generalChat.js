import { chatModel } from "../lib/models";
import { reply, CONTEXT_WINDOW } from "../lib/helpers";

export async function generalChat(state) {
  const authNote = state.isAuthenticated
    ? "The user IS currently logged in, so CV upload is available to them right now — never say they need to log in to upload a CV."
    : "The user is NOT logged in. If relevant, mention they need to log in before they can upload a CV.";

  const SYSTEM = `You are the AI recruiting assistant for this job platform.
Be brief and friendly. You can: search jobs by title/keyword, match a
candidate's uploaded CV against open roles, and walk a logged-in user
through applying (with a confirmation step before anything is submitted).
If the user hasn't stated what job they want, gently prompt them to either
describe a role or upload their CV. ${authNote}
Do not invent job listings — only reference jobs already shown in this
conversation.`;

  const recent = state.messages.slice(-CONTEXT_WINDOW);

  const res = await chatModel
    .invoke([
      { role: "system", content: SYSTEM },
      ...recent.map((m) => ({
        role: m._getType?.() === "human" ? "user" : "assistant",
        content: typeof m.content === "string" ? m.content : "",
      })),
    ])
    .catch((err) => {
      console.error("generalChat failed:", err);
      return null;
    });

  if (!res) {
    return reply(
      "Hi! I can help you search for jobs or apply with your CV — what would you like to do?",
    );
  }

  return { messages: [res] };
}
