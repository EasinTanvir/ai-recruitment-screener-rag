"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import { registerAction } from "./actions";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await registerAction(data);
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Account created successfully.");
      router.push("/user");
    } catch (error) {
      toast.error("Unable to create account. Please try again.");
    } finally {
      setLoading(false);
    }
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
            Candidate registration
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">
            Create your account
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
            Sign up to save jobs, track applications, and personalize your
            candidate profile.
          </p>
        </div>

        <Card className="space-y-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Full name
              </label>
              <Input
                type="text"
                placeholder="Jane Doe"
                {...register("name", {
                  required: "Name is required.",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters.",
                  },
                })}
              />
              {errors.name && fieldError(errors.name.message)}
            </div>

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
                placeholder="Create a secure password"
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters.",
                  },
                })}
              />
              {errors.password && fieldError(errors.password.message)}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-700 transition hover:text-slate-950"
              >
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </main>
  );
}
