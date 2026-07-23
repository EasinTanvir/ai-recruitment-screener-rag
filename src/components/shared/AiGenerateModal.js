"use client";

import { Sparkles, Wand2, RotateCw, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import Button from "@/components/shared/Button";
import Textarea from "@/components/shared/Textarea";

export default function AiGenerateModal({
  open,
  title,
  type,
  prompt,
  generatedText,
  loading,
  onClose,
  onPromptChange,
  onGenerate,
  onInsert,
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
      >
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: 30,
            scale: 0.96,
          }}
          transition={{
            duration: 0.2,
          }}
          className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          {/* Header */}

          <div className="flex items-center justify-between border-b px-8 py-5">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-blue-100 p-3">
                <Sparkles size={24} className="text-blue-600" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">AI Content Generator</h2>

                <p className="text-sm text-slate-500">
                  Generate professional {type} with AI.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Body */}

          <div className="grid flex-1 gap-8 overflow-y-auto p-8 lg:grid-cols-2">
            {/* Left */}

            <div className="space-y-4">
              <div>
                <label className="mb-2 block font-medium">
                  Additional Instructions
                </label>

                <Textarea
                  rows={12}
                  value={prompt}
                  onChange={(e) => onPromptChange(e.target.value)}
                  placeholder={`Example:

• Mention React & Next.js
• Startup environment
• Remote work
• 3+ years experience
`}
                />
              </div>

              <Button
                onClick={onGenerate}
                loading={loading}
                disabled={loading}
                className="w-full"
              >
                <Wand2 size={18} />
                Generate with AI
              </Button>
            </div>

            {/* Right */}

            <div className="flex flex-col">
              <label className="mb-2 block font-medium">
                Generated Content
              </label>

              <div className="flex-1 overflow-y-auto rounded-2xl border bg-slate-50 p-5">
                {loading ? (
                  <div className="space-y-3">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="h-4 animate-pulse rounded bg-slate-200"
                      />
                    ))}
                  </div>
                ) : generatedText ? (
                  <div className="whitespace-pre-wrap text-sm leading-7">
                    {generatedText}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-center text-sm text-slate-400">
                    Click Generate to create content.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}

          <div className="flex items-center justify-between border-t px-8 py-5">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                disabled={!generatedText || loading}
                onClick={onGenerate}
              >
                <RotateCw size={18} />
                Regenerate
              </Button>

              <Button
                disabled={!generatedText}
                onClick={() => onInsert(generatedText)}
              >
                Insert Content
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
