"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";

import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Input from "@/components/shared/Input";
import { loginAction } from "../../../serverAction/auth/loginAction";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await loginAction(data);
      if (result?.error) {
        toast.error(result.error);
        return;
      }

      //toast.success("Signed in successfully.");
      if (result?.user?.role === "ADMIN") {
        router.push("/dashboard");
      } else {
        router.push("/user");
      }
    } catch (error) {
      toast.error("Unable to sign in. Please try again.");
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
      <div className="mx-auto max-w-xl">
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
                })}
              />
              {errors.password && fieldError(errors.password.message)}
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <Button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
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
