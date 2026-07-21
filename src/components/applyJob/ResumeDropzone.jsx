"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FileText, UploadCloud } from "lucide-react";

export default function ResumeDropzone({ file, onChange, disabled }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!acceptedFiles.length) return;

      onChange(acceptedFiles[0]);
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    multiple: false,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition
      ${
        isDragActive
          ? "border-sky-500 bg-sky-50"
          : "border-slate-300 hover:border-slate-400"
      }`}
    >
      <input {...getInputProps()} />

      {file ? (
        <>
          <FileText className="mx-auto mb-4 h-10 w-10 text-sky-600" />

          <p className="font-semibold">{file.name}</p>

          <p className="mt-2 text-sm text-slate-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </>
      ) : (
        <>
          <UploadCloud className="mx-auto mb-4 h-10 w-10 text-slate-400" />

          <p className="font-semibold">Drag & Drop your resume</p>

          <p className="mt-2 text-sm text-slate-500">PDF only • Max 10 MB</p>
        </>
      )}
    </div>
  );
}
