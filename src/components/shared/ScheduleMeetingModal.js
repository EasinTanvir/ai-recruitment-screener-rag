"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Button from "./Button";

export default function ScheduleMeetingModal({
  open,
  onClose,
  message,
  setMessage,
  onGenerateAi,
  onSend,
  loading,
  aiLoading,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold">
              Invite Candidate to Interview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Write a custom message or let AI generate one.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <textarea
            rows={8}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Optional: Add anything you'd like AI to include..."
            className="w-full resize-none rounded-xl border p-4 text-sm outline-none focus:border-slate-900"
          />
        </div>

        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50"
          >
            Cancel
          </button>

          <Button
            variant="outline"
            loading={aiLoading}
            disabled={aiLoading}
            onClick={onGenerateAi}
          >
            ✨ Write with AI
          </Button>

          <button
            onClick={onSend}
            disabled={loading || !message.trim()}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}
