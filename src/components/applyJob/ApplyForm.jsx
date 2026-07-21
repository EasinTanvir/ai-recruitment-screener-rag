"use client";

import { useState } from "react";

import Button from "../shared/Button";
import ResumeDropzone from "./ResumeDropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { applyJobAction } from "../../../serverAction/applyJobAction";

export default function ApplyForm({ jobId }) {
  const { edgestore } = useEdgeStore();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);

    try {
      const upload = await edgestore.publicFiles.upload({
        file,
      });

      console.log("upload url", upload.url);

      const result = await applyJobAction({
        jobId,
        resumeUrl: upload.url,
      });

      console.log(result);
    } catch (error) {
      console.error("upload failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-5">
      <div>
        <p className="font-semibold">Upload Resume</p>

        <p className="text-sm text-slate-500">PDF only (max 10MB)</p>
      </div>

      <ResumeDropzone file={file} onChange={setFile} />

      <Button className="w-full" onClick={handleSubmit} disabled={loading}>
        {loading ? "Uploading..." : "Apply Now"}
      </Button>
    </div>
  );
}
