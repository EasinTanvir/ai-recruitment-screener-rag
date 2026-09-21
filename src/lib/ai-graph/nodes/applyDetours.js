import { reply } from "../lib/helpers";

export async function clarifyApplyTarget(state) {
  if (!state.lastShownJobs?.length) {
    return reply(
      "I don't have a job in view yet — tell me what role you're looking for, or upload your CV first.",
    );
  }
  return reply(
    "Which one did you mean? You can just say the number or the job title from the list above.",
  );
}

export async function needLogin() {
  return reply(
    "You'll need to log in first to apply — once you're logged in, come back and tell me and I'll pick up right where we left off.",
  );
}

export async function needCv(state) {
  return {
    pendingApplyJobId: state.selectedJobId,
    ...reply(
      "Please upload your CV (PDF) using the upload button here in the chat, and I'll get your application ready for that role.",
    ),
  };
}
