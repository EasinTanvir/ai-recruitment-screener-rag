"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, SendHorizonal } from "lucide-react";
import { useState } from "react";

import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({ open, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      message:
        "Hi 👋 I'm your AI Recruiting Assistant. Ask me about jobs, candidates, or company policies.",
    },
  ]);

  const [loading] = useState(true);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 20,
            scale: 0.95,
          }}
          className="fixed bottom-28 right-8 z-50 flex h-[600px] w-[390px] flex-col overflow-hidden rounded-3xl border bg-white shadow-2xl"
        >
          {/* Header */}

          <div className="flex items-center gap-3 border-b px-5 py-4">
            <div className="rounded-full bg-blue-100 p-2">
              <Bot className="text-blue-600" size={20} />
            </div>

            <div>
              <h2 className="font-semibold">ATS Assistant</h2>

              <p className="text-xs text-green-600">Online</p>
            </div>
          </div>

          {/* Messages */}

          <div className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.map((msg, i) => (
              <ChatMessage key={i} {...msg} />
            ))}

            {loading && <TypingIndicator />}
          </div>

          {/* Suggestions */}

          <div className="flex flex-wrap gap-2 border-t border-b p-3">
            {["React jobs", "Frontend candidates", "Dashboard summary"].map(
              (item) => (
                <button
                  key={item}
                  className="rounded-full bg-slate-100 px-3 py-2 text-xs hover:bg-slate-200"
                >
                  {item}
                </button>
              ),
            )}
          </div>

          {/* Input */}

          <form className="flex items-center gap-2 p-4">
            <input
              placeholder="Ask anything..."
              className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none focus:border-blue-500"
            />

            <button className="rounded-xl bg-blue-600 p-3 text-white">
              <SendHorizonal size={18} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
