"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Textarea from "@/components/shared/Textarea";

import { Zap } from "lucide-react";
import { createJobAction } from "../../../../../serverAction/createJobAction";

export default function CreateJobPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      companyName: "",
      description: "",
      requirements: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);

    const res = await createJobAction(data);

    if (res.success) {
      toast.success(res.message);

      reset();

      router.push("/dashboard/jobs");
    } else {
      console.log("errors", res.message);
      toast.error(res.message);
    }

    setLoading(false);
  };

  const fieldError = (message) => (
    <p className="mt-2 text-sm text-rose-600">{message}</p>
  );

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Create Job
        </p>
      </div>

      <Card className="space-y-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Job title
              </label>

              <Input
                {...register("title", {
                  required: "Job title is required.",
                })}
                placeholder="Senior Product Designer"
              />

              {errors.title && fieldError(errors.title.message)}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Company
              </label>

              <Input
                {...register("companyName", {
                  required: "Company name is required.",
                })}
                placeholder="Atlas Labs"
              />

              {errors.companyName && fieldError(errors.companyName.message)}
            </div>
          </div>

          <div className="relative">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Description
            </label>

            <Textarea
              {...register("description", {
                required: "Description is required.",
              })}
              rows={8}
            />

            {errors.description && fieldError(errors.description.message)}

            <Button
              variant="ghost"
              type="button"
              className="absolute right-2 top-10"
            >
              <Zap size={18} />
            </Button>
          </div>

          <div className="relative">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Requirements
            </label>

            <Textarea
              {...register("requirements", {
                required: "Requirements are required.",
              })}
              rows={8}
            />

            {errors.requirements && fieldError(errors.requirements.message)}

            <Button
              variant="ghost"
              type="button"
              className="absolute right-2 top-10"
            >
              <Zap size={18} />
            </Button>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} loading={loading}>
              Create Job
            </Button>

            <Button type="button" variant="secondary" disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
