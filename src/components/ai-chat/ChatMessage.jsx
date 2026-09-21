"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkDirective from "remark-directive";
import { visit } from "unist-util-visit";
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

// ---------------------------------------------------------------------------
// Turns remark-directive nodes (:warn[...], ::: warn ... :::) into elements
// react-markdown's `components` map can target by name. Inline directives
// (:name[...]) keep their name as-is; block/container directives (:::name)
// get a "-block" suffix so we can render them differently (a full callout
// box vs an inline colored span).
// ---------------------------------------------------------------------------
function remarkDirectiveToHast() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        const data = node.data || (node.data = {});
        const isBlock = node.type === "containerDirective";
        data.hName = isBlock ? `${node.name}-block` : node.name;
        data.hProperties = node.attributes || {};
      }
    });
  };
}

// Inline semantic markers — agent writes :warn[log in first], etc.
const directiveComponents = {
  danger: ({ node, ...props }) => (
    <strong className="font-bold text-red-600" {...props} />
  ),
  warn: ({ node, ...props }) => (
    <strong className="font-bold text-amber-600" {...props} />
  ),
  success: ({ node, ...props }) => (
    <strong className="font-bold text-emerald-600" {...props} />
  ),
  info: ({ node, ...props }) => (
    <strong className="font-bold text-blue-600" {...props} />
  ),
  highlight: ({ node, ...props }) => (
    <mark
      className="rounded bg-yellow-100 px-1 font-semibold text-slate-900"
      {...props}
    />
  ),
  // Block versions — agent writes:
  // :::warn
  // Please log in before uploading your CV.
  // :::
  "danger-block": ({ node, ...props }) => (
    <div
      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-800 [&_p]:m-0"
      {...props}
    />
  ),
  "warn-block": ({ node, ...props }) => (
    <div
      className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 [&_p]:m-0"
      {...props}
    />
  ),
  "success-block": ({ node, ...props }) => (
    <div
      className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800 [&_p]:m-0"
      {...props}
    />
  ),
  "info-block": ({ node, ...props }) => (
    <div
      className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-800 [&_p]:m-0"
      {...props}
    />
  ),
};

// ---------------------------------------------------------------------------
// Markdown -> styled JSX mapping. This is where headings get color, bold
// gets weight/color, bullets get custom markers, code gets a mono block, etc.
// Tweak classNames here to change the whole app's chat look in one place.
// ---------------------------------------------------------------------------
const markdownComponents = {
  h1: ({ node, ...props }) => (
    <h1 className="mt-2 mb-1 text-lg font-bold text-blue-700" {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className="mt-2 mb-1 text-base font-bold text-blue-700" {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3
      className="mt-2 mb-1 text-sm font-bold uppercase tracking-wide text-blue-600"
      {...props}
    />
  ),
  p: ({ node, ...props }) => (
    <p className="mb-2 text-sm leading-6 text-slate-700 last:mb-0" {...props} />
  ),
  strong: ({ node, ...props }) => (
    <strong className="font-semibold text-slate-900" {...props} />
  ),
  em: ({ node, ...props }) => (
    <em className="italic text-slate-600" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul
      className="mb-2 ml-1 list-none space-y-1.5 text-sm text-slate-700 last:mb-0"
      {...props}
    />
  ),
  ol: ({ node, ...props }) => (
    <ol
      className="mb-2 ml-4 list-decimal space-y-1.5 text-sm text-slate-700 marker:font-semibold marker:text-blue-600 last:mb-0"
      {...props}
    />
  ),
  li: ({ node, ordered, ...props }) =>
    ordered ? (
      <li className="pl-1" {...props} />
    ) : (
      <li className="flex gap-2">
        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
        <span className="flex-1" {...props} />
      </li>
    ),
  a: ({ node, ...props }) => (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      className="font-medium text-blue-600 underline underline-offset-2 hover:text-blue-700"
    />
  ),
  code: ({ node, inline, className, children, ...props }) =>
    inline ? (
      <code
        className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-rose-600"
        {...props}
      >
        {children}
      </code>
    ) : (
      <pre className="mb-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-[13px] text-slate-100">
        <code className="font-mono" {...props}>
          {children}
        </code>
      </pre>
    ),
  blockquote: ({ node, ...props }) => (
    <blockquote
      className="mb-2 border-l-2 border-blue-300 pl-3 text-sm italic text-slate-500 last:mb-0"
      {...props}
    />
  ),
  hr: () => <hr className="my-3 border-slate-200" />,
  table: ({ node, ...props }) => (
    <div className="mb-2 overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-left text-xs" {...props} />
    </div>
  ),
  thead: ({ node, ...props }) => <thead className="bg-slate-50" {...props} />,
  th: ({ node, ...props }) => (
    <th
      className="border-b border-slate-200 px-2.5 py-1.5 font-semibold text-slate-600"
      {...props}
    />
  ),
  td: ({ node, ...props }) => (
    <td
      className="border-b border-slate-100 px-2.5 py-1.5 text-slate-700"
      {...props}
    />
  ),
};

function AssistantContent({ content }) {
  // No more manual splitting/regex — remark-directive handles both inline
  // (:warn[...]) and block (:::warn ... :::) semantic markers the agent
  // chooses to emit, on top of normal markdown.
  return (
    <div className="text-sm">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveToHast]}
        components={{ ...markdownComponents, ...directiveComponents }}
      >
        {content}
      </ReactMarkdown>
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
