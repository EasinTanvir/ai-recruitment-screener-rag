"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    toast.success("Login submitted. UI mock only.");
    console.log("Login data:", data);
  };

  const fieldError = (message) => (
    <p className="mt-2 text-sm text-rose-600">{message}</p>
  );

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-12 lg:px-10">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 rounded-4xl bg-white p-10 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.25)]">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            Candidate login
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            Sign in to your account
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Access your candidate dashboard, review applications, and manage
            your profile.
          </p>
        </div>

        <Card className="space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
              />
              {errors.email && fieldError(errors.email.message)}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters.",
                  },
                })}
              />
              {errors.password && fieldError(errors.password.message)}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit">Sign in</Button>
              <Link
                href="/register"
                className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
              >
                New to the platform? Create account
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
