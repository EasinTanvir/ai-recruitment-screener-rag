"use client";

import { useRef } from "react";

/**
 * Drop this into your existing ChatWindow's input row:
 *
 *   <ResumeUploadButton disabled={!canUploadCv || loading} onSelect={onUploadCv} />
 *
 * Disabled (greyed out, tooltip) whenever the user isn't logged in.
 */
export default function ResumeUploadButton({ disabled, onSelect }) {
  const inputRef = useRef(null);

  return (
    <>
      <button
        type="button"
        title={disabled ? "Log in to upload your CV" : "Upload your CV (PDF)"}
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
      >
        📎
      </button>
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
    </>
  );
}
