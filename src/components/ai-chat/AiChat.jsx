"use client";

import { useEffect, useState } from "react";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";
import { useEdgeStore } from "@/lib/edgestore";
import toast from "react-hot-toast";

const STORAGE_KEY = "ats-ai-chat";
const THREAD_KEY = "ats-ai-chat-thread";

const WELCOME_LOGGED_IN =
  "Hi there! 👋 How can I help you today — are you looking for a specific role, or would you like to upload your CV so I can match you with open positions?";

const WELCOME_LOGGED_OUT =
  "Hi there! 👋 How can I help you today — are you looking for a specific role? (Log in if you'd like to upload your CV so I can match you with open positions.)";

function buildWelcome(isLoggedIn) {
  return {
    id: "welcome",
    role: "assistant",
    content: isLoggedIn ? WELCOME_LOGGED_IN : WELCOME_LOGGED_OUT,
  };
}

/**
 * @param {boolean} isLoggedIn - pass this from a server component / auth
 *   context you already have. CV upload is disabled when false.
 */
export default function AiChat({ isLoggedIn = false }) {
  const { edgestore } = useEdgeStore();
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState(() => {
    if (typeof window === "undefined") return [buildWelcome(isLoggedIn)];
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [buildWelcome(isLoggedIn)];
  });

  // one thread id per browser tab session; this is what lets the langgraph
  // checkpointer remember CV, pending apply, etc. across turns
  const [threadId] = useState(() => {
    if (typeof window === "undefined") return "server";
    const existing = sessionStorage.getItem(THREAD_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem(THREAD_KEY, id);
    return id;
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // when the graph pauses (apply confirmation), we track that so the next
  // send goes through as a `resume`, not a normal chat message
  const [pendingInterrupt, setPendingInterrupt] = useState(null);

  async function callChatApi(payload) {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ threadId, ...payload }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || "The chat request failed.");
    }

    return data;
  }

  function pushAssistantMessage(data) {
    const toolResult =
      data.toolResult ??
      (data.interrupt
        ? { type: "apply_confirmation", ...data.interrupt }
        : null);

    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message,
        toolResult,
      },
    ]);
    setPendingInterrupt(data.interrupt ?? null);
  }

  async function sendMessage(message) {
    if (!message.trim() || loading) return;

    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", content: message },
    ]);
    setInput("");
    setLoading(true);

    try {
      // if we're currently waiting on a confirm/cancel, this reply
      // resumes the paused graph instead of starting a fresh turn
      const data = pendingInterrupt
        ? await callChatApi({ resume: message })
        : await callChatApi({ message });

      pushAssistantMessage(data);
    } catch (error) {
      console.error("Chat request failed:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: error.message || "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function uploadCv(file) {
    if (!isLoggedIn || !file || uploading || loading) return;

    setUploading(true);
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: `📎 Uploaded ${file.name}`,
      },
    ]);

    try {
      const uploaded = await edgestore.publicFiles.upload({ file });
      setLoading(true);
      const data = await callChatApi({ resumeUrl: uploaded.url });
      pushAssistantMessage(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to upload CV.");
    } finally {
      setUploading(false);
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
        loading={loading || uploading}
        input={input}
        setInput={setInput}
        onSend={sendMessage}
        onUploadCv={uploadCv}
        canUploadCv={isLoggedIn}
      />
      <ChatButton open={open} onClick={() => setOpen(!open)} />
    </>
  );
}
