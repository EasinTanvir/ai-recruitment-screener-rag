"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { RotateCcw } from "lucide-react";

import ScheduleMeetingModal from "../shared/ScheduleMeetingModal";
import { scheduleMeetingAction } from "../../../serverAction/scheduleMeetingAction";

export default function CandidateActions({ application }) {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSend(message) {
    setLoading(true);

    try {
      const result = await scheduleMeetingAction({
        applicationId: application.id,
        message,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);

      setOpen(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-800"
      >
        <RotateCcw className="h-4 w-4" />
        Invite to Interview
      </button>

      <ScheduleMeetingModal
        open={open}
        loading={loading}
        onClose={() => setOpen(false)}
        onSend={handleSend}
      />
    </>
  );
}
