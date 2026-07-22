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

  const textareaRef = useRef(null);

  const handleInput = (e) => {
    setInput(e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading, open]);
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

              if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
              }
            }}
            className="border-t bg-white p-4"
          >
            <div className="flex items-end gap-3 rounded-2xl border bg-white px-3 py-2 shadow-sm transition focus-within:border-blue-500">
              <textarea
                ref={textareaRef}
                rows={1}
                value={input}
                disabled={loading}
                onChange={handleInput}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    onSend(input);

                    if (textareaRef.current) {
                      textareaRef.current.style.height = "auto";
                    }
                  }
                }}
                placeholder="Ask anything..."
                className="max-h-[140px] flex-1 resize-none overflow-y-auto bg-transparent py-2 text-sm outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <SendHorizonal size={18} />
              </button>
            </div>

            <p className="mt-2 text-center text-[11px] text-slate-400">
              Press <span className="font-medium">Enter</span> to send •{" "}
              <span className="font-medium">Shift + Enter</span> for a new line
            </p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
