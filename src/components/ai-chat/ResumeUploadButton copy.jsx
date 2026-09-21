"use client";

import { useRef } from "react";
import { Paperclip } from "lucide-react";

/**
 * Drop this into your existing ChatWindow's input row, e.g.:
 *
 *   <div className="flex items-center gap-2 border-t p-3">
 *     <ResumeUploadButton disabled={!canUploadCv || loading} onSelect={onUploadCv} />
 *     <input ... />
 *     <button onClick={...}>Send</button>
 *   </div>
 *
 * canUploadCv / onUploadCv are already passed down from AiChat.jsx as props
 * to ChatWindow — just forward them to this component.
 */
export default function ResumeUploadButton({ disabled, onSelect }) {
  const inputRef = useRef(null);

  return (
    <div className="group relative flex items-center">
      <button
        type="button"
        aria-label={disabled ? "Log in to upload your CV" : "Upload your CV (PDF)"}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <Paperclip size={16} />
      </button>

      {/* simple CSS tooltip, no extra deps */}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-max -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100"
      >
        {disabled ? "Log in to upload your CV" : "Upload your CV (PDF)"}
      </span>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = ""; // allow re-selecting the same file later
          if (file) onSelect(file);
        }}
      />
    </div>
  );
}
