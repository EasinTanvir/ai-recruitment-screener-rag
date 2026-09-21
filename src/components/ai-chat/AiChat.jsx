"use client";

import { useEffect, useState } from "react";
import ChatButton from "./ChatButton";
import ChatWindow from "./ChatWindow";

import toast from "react-hot-toast";
import { useEdgeStore } from "@/lib/edgestore";

const STORAGE_KEY = "ats-ai-chat";
const THREAD_KEY = "ats-ai-chat-thread";

const WELCOME = {
  id: "welcome",
  role: "assistant",
  content:
    "Hi 👋 I'm your AI Recruiting Assistant. Tell me about the kind of job you're looking for, or upload your CV and I'll match you to open roles.",
};

/**
 * @param {boolean} isLoggedIn - pass this from a server component / auth
 *   context you already have. CV upload is disabled when false.
 */
export default function AiChat({ isLoggedIn = false }) {
  const { edgestore } = useEdgeStore();
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState(() => {
    if (typeof window === "undefined") return [WELCOME];
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [WELCOME];
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
    return response.json();
  }

  function pushAssistantMessage(data) {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.message,
        toolResult: data.toolResult ?? null,
        interrupt: data.interrupt ?? null,
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
      toast.error("Failed to upload CV.");
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
