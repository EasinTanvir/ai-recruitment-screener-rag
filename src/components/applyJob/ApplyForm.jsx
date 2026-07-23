"use client";

import { useState } from "react";

import Button from "../shared/Button";
import ResumeDropzone from "./ResumeDropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { applyJobAction } from "../../../serverAction/applyJobAction";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ApplyForm({ jobId, alreadyApplied }) {
  const { edgestore } = useEdgeStore();
  const router = useRouter();
  const [status, setStatus] = useState("");

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const disabled = loading || alreadyApplied;

  const handleSubmit = async () => {
    if (disabled || !file) return;

    setLoading(true);

    try {
      setStatus("Uploading resume...");

      const upload = await edgestore.publicFiles.upload({
        file,
      });

      setStatus("Analyzing your application...");

      const result = await applyJobAction({
        jobId,
        resumeUrl: upload.url,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success("Application submitted successfully!");

      router.refresh();
    } catch (error) {
      console.error(error);

      toast.error("Failed to submit application.");
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  return (
    <div className="mt-8 space-y-5">
      {alreadyApplied && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="font-semibold text-green-700">✓ Already Applied</p>

          <p className="mt-1 text-sm text-green-600">
            You have already applied for this position. Multiple applications
            for the same job are not allowed.
          </p>
        </div>
      )}

      <div>
        <p className="font-semibold">Upload Resume</p>

        <p className="text-sm text-slate-500">PDF only (max 10MB)</p>
      </div>

      <div className={alreadyApplied ? "pointer-events-none opacity-50" : ""}>
        <ResumeDropzone
          file={file}
          onChange={setFile}
          disabled={alreadyApplied}
        />
      </div>

      <Button className="w-full" onClick={handleSubmit} disabled={disabled}>
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

            <span>{status}</span>
          </div>
        ) : alreadyApplied ? (
          "Already Applied"
        ) : (
          "Apply Now"
        )}
      </Button>
    </div>
  );
}
