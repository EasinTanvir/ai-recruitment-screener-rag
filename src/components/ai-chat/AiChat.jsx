"use client";

import { useState } from "react";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";

export default function AiChat() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hi 👋 I'm your AI Recruiting Assistant. Ask me about jobs, candidates, or company policies.",
    },
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(false);

  async function sendMessage(message) {
    if (!message.trim() || loading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.message,
          toolResult: data.toolResult ?? null,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <ChatWindow
        open={open}
        messages={messages}
        loading={loading}
        input={input}
        setInput={setInput}
        onSend={sendMessage}
      />

      <ChatButton open={open} onClick={() => setOpen(!open)} />
    </>
  );
}
