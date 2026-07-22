"use client";

import { motion } from "framer-motion";

export default function ChatMessage({ role, message }) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
          isUser ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700"
        }`}
      >
        {message}
      </div>
    </motion.div>
  );
}
