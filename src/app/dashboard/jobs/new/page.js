"use client";

import { useForm } from "react-hook-form";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import Textarea from "@/components/shared/Textarea";

export default function CreateJobPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      company: "",
      location: "",
      employmentType: "",
      salary: "",
      description: "",
      responsibilities: "",
      requirements: "",
      benefits: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Job data:", data);
  };

  const fieldError = (message) => (
    <p className="mt-2 text-sm text-rose-600">{message}</p>
  );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
          Create job
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
          Post a new role
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Use this form to design a clean job listing interface. All fields are
          mock-only and do not submit.
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
                {...register("title", { required: "Job title is required." })}
                placeholder="Senior Product Designer"
              />
              {errors.title && fieldError(errors.title.message)}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Company
              </label>
              <Input
                {...register("company", {
                  required: "Company name is required.",
                })}
                placeholder="Atlas Labs"
              />
              {errors.company && fieldError(errors.company.message)}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Location
              </label>
              <Input
                {...register("location", { required: "Location is required." })}
                placeholder="Remote"
              />
              {errors.location && fieldError(errors.location.message)}
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Employment type
              </label>
              <Input
                {...register("employmentType", {
                  required: "Employment type is required.",
                })}
                placeholder="Full-time"
              />
              {errors.employmentType &&
                fieldError(errors.employmentType.message)}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Short description
            </label>
            <Textarea
              {...register("description", {
                required: "Short description is required.",
              })}
              placeholder="Lead product initiatives across mobile and web teams."
              rows={4}
            />
            {errors.description && fieldError(errors.description.message)}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Requirements
            </label>
            <Textarea
              {...register("requirements", {
                required: "Requirements are required.",
              })}
              placeholder="5+ years of experience, strong portfolio, collaboration skills."
              rows={4}
            />
            {errors.requirements && fieldError(errors.requirements.message)}
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button type="submit">Create Job</Button>
            <Button variant="secondary" type="button">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
