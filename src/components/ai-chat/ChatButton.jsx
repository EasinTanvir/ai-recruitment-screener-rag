"use client";

import { motion } from "framer-motion";
import { Bot, X } from "lucide-react";

export default function ChatButton({ open, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      animate={
        open
          ? {}
          : {
              scale: [1, 1.08, 1],
              boxShadow: [
                "0 0 0 rgba(59,130,246,.4)",
                "0 0 24px rgba(59,130,246,.8)",
                "0 0 0 rgba(59,130,246,.4)",
              ],
            }
      }
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
      onClick={onClick}
      className="fixed bottom-8 cursor-pointer right-8 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl"
    >
      {open ? <X size={28} /> : <Bot size={28} />}
    </motion.button>
  );
}
