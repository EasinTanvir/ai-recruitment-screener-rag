"use client";

import { motion } from "framer-motion";

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-2xl bg-slate-100 px-4 py-3 w-fit">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-slate-500"
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}
