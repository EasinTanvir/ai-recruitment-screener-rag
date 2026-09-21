import { reply } from "../lib/helpers";

export async function askJobPreference(state) {
  const cvHint = state.isAuthenticated
    ? "upload your CV with the 📎 button and I'll match you automatically"
    : "log in to upload your CV and I'll match you automatically";

  return reply(
    `Sure! What kind of role are you looking for — a title, or a few key skills? You can tell me directly, or ${cvHint}.`,
  );
}
