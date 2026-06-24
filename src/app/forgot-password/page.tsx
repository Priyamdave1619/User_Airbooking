"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthCard } from "@/components/auth/AuthCard";
import { TextField } from "@/components/auth/TextField";
import { PasswordField } from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/Button";

const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.\w{2,}$/;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"request" | "reset" | "done">("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function handleRequest(e: FormEvent) {
    e.preventDefault();
    if (!email || !EMAIL_REGEX.test(email)) {
      setErrors({ email: "Enter a valid, registered email address" });
      return;
    }
    setErrors({});
    setStep("reset");
  }

  function handleReset(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters" });
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ password: "Passwords do not match" });
      return;
    }
    setErrors({});
    setStep("done");
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {step === "request" && (
          <AuthCard
            title="Forgot password"
            subtitle="Enter the email linked to your account and we'll send a reset link."
          >
            <form onSubmit={handleRequest} className="flex flex-col gap-5" noValidate>
              <TextField
                id="email"
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={errors.email}
              />
              <Button type="submit" size="lg" className="w-full">
                Send reset link
              </Button>
              <Link href="/login" className="text-center text-sm font-semibold text-sky-600 hover:underline">
                Back to sign in
              </Link>
            </form>
          </AuthCard>
        )}

        {step === "reset" && (
          <AuthCard
            title="Set a new password"
            subtitle={`We've sent a confirmation to ${email}. Set your new password below.`}
          >
            <form onSubmit={handleReset} className="flex flex-col gap-5" noValidate>
              <PasswordField
                id="password"
                label="New password"
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
              />
              <PasswordField
                id="confirmPassword"
                label="Confirm new password"
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button type="submit" size="lg" className="w-full">
                Update password
              </Button>
            </form>
          </AuthCard>
        )}

        {step === "done" && (
          <AuthCard title="Password updated" subtitle="You can now sign in with your new password.">
            <Link href="/login">
              <Button size="lg" className="w-full">
                Go to sign in
              </Button>
            </Link>
          </AuthCard>
        )}
      </main>
      <Footer />
    </>
  );
}
