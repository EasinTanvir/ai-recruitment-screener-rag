export async function safeStructured(model, messages, fallback, label) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      return await model.invoke(messages);
    } catch (err) {
      if (attempt === 1) {
        console.error(`[safeStructured:${label}] falling back —`, err.message);
        return fallback;
      }
    }
  }
}
