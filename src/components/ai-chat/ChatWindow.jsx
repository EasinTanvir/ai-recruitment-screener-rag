"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, SendHorizonal } from "lucide-react";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { useEffect, useRef } from "react";

const suggestions = [
  "Any React jobs Available?",
  "Any Frontend Developer jobs Available?",
];

export default function ChatWindow({
  open,
  messages,
  loading,
  input,
  setInput,
  onSend,
}) {
  const messagesRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);
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
          transition={{
            duration: 0.2,
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

          <div
            ref={messagesRef}
            className="flex-1 space-y-4 overflow-y-auto p-5"
          >
            {messages.map((message) => (
              <ChatMessage key={message.id} {...message} />
            ))}

            {loading && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}

          {/* <div className="flex flex-wrap gap-2 border-y p-3">
            {suggestions.map((item) => (
              <button
                key={item}
                onClick={() => onSend(item)}
                disabled={loading}
                className="rounded-full bg-slate-100 px-3 py-2 text-xs transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {item}
              </button>
            ))}
          </div> */}

          {/* Input */}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSend(input);
            }}
            className="flex items-center gap-2 p-4"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={loading}
              className="flex-1 rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-blue-500 disabled:bg-slate-100"
            />

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-blue-600 p-3 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <SendHorizonal size={18} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
