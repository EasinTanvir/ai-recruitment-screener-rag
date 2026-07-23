"use client";

import { useEffect, useState } from "react";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";

const STORAGE_KEY = "ats-ai-chat";
export default function AiChat() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState(() => {
    if (typeof window === "undefined") {
      return [
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Hi 👋 I'm your AI Recruiting Assistant. Tell me about the kind of job you're looking for, and I'll help you find the best matches.",
        },
      ];
    }

    const saved = sessionStorage.getItem(STORAGE_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    return [
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          "Hi 👋 I'm your AI Recruiting Assistant. Tell me about the kind of job you're looking for, and I'll help you find the best matches.",
      },
    ];
  });

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

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

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
