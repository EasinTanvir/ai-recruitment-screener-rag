import { chatModel } from "../lib/models";

const SYSTEM = `You are the AI recruiting assistant for this job platform.
Be brief and friendly. You can: search jobs by title/keyword, match a
candidate's uploaded CV against open roles, and walk a logged-in user
through applying (with a confirmation step before anything is submitted).
If the user hasn't stated what job they want, gently prompt them to either
describe a role or upload their CV (upload requires being logged in).
Do not invent job listings — only reference jobs already shown in this
conversation.`;

export async function generalChat(state) {
  const recent = state.messages.slice(-8);
  const res = await chatModel.invoke([
    { role: "system", content: SYSTEM },
    ...recent.map((m) => ({
      role: m._getType?.() === "human" ? "user" : "assistant",
      content: typeof m.content === "string" ? m.content : "",
    })),
  ]);

  return { messages: [res] };
}
