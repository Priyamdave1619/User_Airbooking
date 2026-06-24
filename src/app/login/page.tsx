"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthCard } from "@/components/auth/AuthCard";
import { TextField } from "@/components/auth/TextField";
import { PasswordField } from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.\w{2,}$/;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};

    if (!email) {
      nextErrors.email = "Please enter your email";
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = "Enter a valid email address";
    }
    if (!password) {
      nextErrors.password = "Please enter your password";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    login(email);
    router.push("/");
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <AuthCard
          title="Sign in"
          subtitle={
            <>
              First time here? Use{" "}
              <Link href="/register" className="font-semibold text-sky-600">
                Create account
              </Link>{" "}
              instead.
            </>
          }
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <TextField
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <PasswordField
              id="password"
              label="Password"
              autoComplete="current-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <div className="flex items-center justify-between text-sm">
              <Link href="/forgot-password" className="font-semibold text-sky-600 hover:underline">
                Forgot password?
              </Link>
              <Link href="/register" className="font-semibold text-sky-600 hover:underline">
                Create account
              </Link>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Sign In
            </Button>
          </form>
        </AuthCard>
      </main>
      <Footer />
    </>
  );
}
