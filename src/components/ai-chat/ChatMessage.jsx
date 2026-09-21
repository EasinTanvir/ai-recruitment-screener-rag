"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Building2,
  ArrowRight,
  UserRound,
  Mail,
  Gauge,
  Check,
  X,
} from "lucide-react";

function InlineText({ text }) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-semibold text-slate-950">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}

function AssistantContent({ content }) {
  const lines = content.split("\n");

  return (
    <div className="space-y-2 text-sm leading-6">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={`space-${index}`} className="h-1" />;

        const isUploadPrompt = /upload (your |a )?cv|upload (your |a )?resume/i.test(trimmed);
        const isLoginPrompt = /log in|sign in/i.test(trimmed);
        const isSuccess = /application submitted|successfully applied/i.test(trimmed);
        const isHeading = /^#{1,3}\s+/.test(trimmed);
        const listMatch = trimmed.match(/^(?:[-*]|\d+[.)])\s+(.+)/);

        if (isUploadPrompt || isLoginPrompt || isSuccess) {
          const tone = isUploadPrompt
            ? "border-rose-200 bg-rose-50 text-rose-800"
            : isLoginPrompt
              ? "border-amber-200 bg-amber-50 text-amber-800"
              : "border-emerald-200 bg-emerald-50 text-emerald-800";

          return (
            <div key={index} className={`rounded-lg border px-3 py-2 font-semibold ${tone}`}>
              <InlineText text={trimmed.replace(/^#{1,3}\s+/, "")} />
            </div>
          );
        }

        if (isHeading) {
          return (
            <h3 key={index} className="pt-1 text-base font-bold text-blue-700">
              <InlineText text={trimmed.replace(/^#{1,3}\s+/, "")} />
            </h3>
          );
        }

        if (listMatch) {
          return (
            <div key={index} className="flex gap-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-slate-700">
              <span className="font-bold text-blue-600">•</span>
              <span><InlineText text={listMatch[1]} /></span>
            </div>
          );
        }

        return (
          <p key={index}>
            <InlineText text={trimmed} />
          </p>
        );
      })}
    </div>
  );
}

export default function ChatMessage({
  role,
  content,
  toolResult,
  onSend,
  loading,
}) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.2,
      }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white"
            : "border border-slate-200 bg-white text-slate-700"
        }`}
      >
        {/* Message */}

        {!!content &&
          (isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-6">{content}</p>
          ) : (
            <AssistantContent content={content} />
          ))}

        {/* ====================================================== */}
        {/* JOB RESULTS */}
        {/* ====================================================== */}

        {toolResult?.type === "jobs" && toolResult.items?.length > 0 && (
          <div className="mt-4 space-y-3">
            {toolResult.items.map((job) => (
              <div
                key={job.id}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-100 p-2">
                    <BriefcaseBusiness size={18} className="text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">
                      {job.title}
                    </h3>

                    {job.companyName && (
                      <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                        <Building2 size={14} />

                        <span>{job.companyName}</span>
                      </div>
                    )}

                    {typeof job.matchScore === "number" && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-200">
                          <div
                            className="h-full rounded-full bg-blue-600"
                            style={{ width: `${job.matchScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-blue-700">
                          {job.matchScore}% match
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <Link
                  href={job.url}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  View Job
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* ====================================================== */}
        {/* NO JOB FOUND */}
        {/* ====================================================== */}

        {toolResult?.type === "jobs" && toolResult.items?.length === 0 && (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
            No matching jobs found.
          </div>
        )}

        {/* ====================================================== */}
        {/* HITL: APPLY CONFIRMATION */}
        {/* ====================================================== */}

        {toolResult?.type === "apply_confirmation" && (
          <div className="mt-4 space-y-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <BriefcaseBusiness size={18} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {toolResult.job?.title}
                </h3>
                {toolResult.job?.companyName && (
                  <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                    <Building2 size={14} />
                    <span>{toolResult.job.companyName}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5 rounded-lg bg-white p-3 text-sm">
              {(toolResult.applicant?.firstName ||
                toolResult.applicant?.lastName) && (
                <div className="flex items-center gap-2 text-slate-600">
                  <UserRound size={14} />
                  <span>
                    {toolResult.applicant.firstName}{" "}
                    {toolResult.applicant.lastName}
                  </span>
                </div>
              )}
              {toolResult.applicant?.email && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail size={14} />
                  <span>{toolResult.applicant.email}</span>
                </div>
              )}
              {typeof toolResult.matchScore === "number" && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Gauge size={14} />
                  <span>{toolResult.matchScore}% estimated match</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onSend?.("confirm")}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Check size={16} />
                Confirm
              </button>
              <button
                onClick={() => onSend?.("cancel")}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ====================================================== */}
        {/* FUTURE: CANDIDATES */}
        {/* ====================================================== */}

        {toolResult?.type === "candidates" && (
          <div className="mt-4 rounded-xl border p-4">
            Candidate UI Coming Soon...
          </div>
        )}

        {/* ====================================================== */}
        {/* FUTURE: DASHBOARD */}
        {/* ====================================================== */}

        {toolResult?.type === "dashboard" && (
          <div className="mt-4 rounded-xl border p-4">
            Dashboard Widget Coming Soon...
          </div>
        )}

        {/* ====================================================== */}
        {/* FUTURE: ANALYTICS */}
        {/* ====================================================== */}

        {toolResult?.type === "analytics" && (
          <div className="mt-4 rounded-xl border p-4">
            Analytics Widget Coming Soon...
          </div>
        )}
      </div>
    </motion.div>
  );
}
