/**
 * Wraps a `.withStructuredOutput(...)`-bound model so a malformed/unparsable
 * generation (Groq's `output_parse_failed` / `json_validate_failed`, or a
 * transient network error) degrades to a sensible fallback instead of
 * throwing all the way up to the API route.
 */
export async function safeStructured(boundModel, messages, fallback, label) {
  try {
    return await boundModel.invoke(messages);
  } catch (err) {
    console.error(
      `[safeStructured:${label}] falling back —`,
      err?.message || err,
    );
    return fallback;
  }
}
