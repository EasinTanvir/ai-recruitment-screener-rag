"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BriefcaseBusiness, Building2, ArrowRight } from "lucide-react";

export default function ChatMessage({ role, content, toolResult }) {
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

        {!!content && (
          <p className="whitespace-pre-wrap text-sm leading-6">{content}</p>
        )}

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
