"use client";

import { useState } from "react";

import Button from "../shared/Button";
import ResumeDropzone from "./ResumeDropzone";

export default function ApplyForm({ jobId }) {
  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload your resume.");
      return;
    }

    console.log(file);

    // Upload
    // Parse PDF
    // Call server action
  };

  return (
    <div className="mt-8 space-y-5">
      <div>
        <p className="font-semibold">Upload Resume</p>

        <p className="text-sm text-slate-500">PDF only (max 10MB)</p>
      </div>

      <ResumeDropzone file={file} onChange={setFile} />

      <Button className="w-full" onClick={handleSubmit}>
        Apply Now
      </Button>
    </div>
  );
}
