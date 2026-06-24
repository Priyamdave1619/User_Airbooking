"use client";

import Link from "next/link";
import { FormEvent, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthCard } from "@/components/auth/AuthCard";
import { TextField } from "@/components/auth/TextField";
import { PasswordField } from "@/components/auth/PasswordField";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { CheckCircle2, Loader2, Mail, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const EMAIL_REGEX = /^[\w.-]+@[\w.-]+\.\w{2,}$/;

type Step = "form" | "otp" | "success";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  birthday: string;
  password: string;
  confirmPassword: string;
}

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Each slot holds exactly one char or empty string
  const slots: string[] = Array.from({ length: 6 }, (_, i) => value[i] ?? "");

  function handleChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    // Accept only the last digit typed
    const char = e.target.value.replace(/\D/g, "").slice(-1);
    const next = [...slots];
    next[i] = char;
    onChange(next.join(""));
    if (char && i < 5) {
      setTimeout(() => inputsRef.current[i + 1]?.focus(), 0);
    }
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...slots];
      if (next[i]) {
        // Clear current slot
        next[i] = "";
        onChange(next.join(""));
      } else if (i > 0) {
        // Move back and clear previous
        next[i - 1] = "";
        onChange(next.join(""));
        inputsRef.current[i - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputsRef.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < 5) {
      inputsRef.current[i + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = Array.from({ length: 6 }, (_, i) => pasted[i] ?? "");
    onChange(next.join(""));
    const focusIdx = Math.min(pasted.length, 5);
    setTimeout(() => inputsRef.current[focusIdx]?.focus(), 0);
  }

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    // Select existing content so next keystroke replaces it
    e.target.select();
  }

  return (
    <div className="flex justify-center gap-3">
      {slots.map((digit, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={handleFocus}
          className={cn(
            "h-14 w-12 rounded-xl border-2 text-center text-xl font-bold text-navy-900 outline-none transition-all duration-200 bg-white",
            digit
              ? "border-sky-500 bg-sky-50 shadow-sm shadow-sky-100"
              : "border-slate-200 hover:border-slate-300 focus:border-sky-500 focus:bg-sky-50"
          )}
        />
      ))}
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    birthday: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [otpSending, setOtpSending] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Mock OTP — always "123456" for demo
  const MOCK_OTP = "123456";

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validateForm(): boolean {
    const next: typeof errors = {};
    if (!form.firstName) next.firstName = "First name is required";
    if (!form.lastName) next.lastName = "Surname is required";
    if (!form.email || !EMAIL_REGEX.test(form.email)) next.email = "Enter a valid email address";
    if (!form.password || form.password.length < 8) next.password = "Password must be at least 8 characters";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSendOtp() {
    if (!validateForm()) return;
    setOtpSending(true);
    await new Promise((r) => setTimeout(r, 1400));
    setOtpSending(false);
    setStep("otp");
    setCountdown(30);
  }

  async function handleResend() {
    if (countdown > 0) return;
    setOtp("");
    setOtpError("");
    setCountdown(30);
  }

  async function handleVerifyOtp(e: FormEvent) {
    e.preventDefault();
    const filled = otp.replace(/\s/g, "");
    if (filled.length < 6) {
      setOtpError("Please enter all 6 digits");
      return;
    }
    if (filled !== MOCK_OTP) {
      setOtpError("Incorrect code. Try 123456 for this demo.");
      return;
    }
    setOtpError("");
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 900));
    register({ firstName: form.firstName, lastName: form.lastName, email: form.email });
    setSubmitting(false);
    setStep("success");
    await new Promise((r) => setTimeout(r, 1800));
    router.push("/");
  }

  if (step === "success") {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          <AuthCard title="">
            <div className="flex flex-col items-center gap-5 py-6 animate-scaleIn">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 animate-pulse-once">
                <CheckCircle2 size={44} className="text-green-500" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-navy-900">Account Created!</h2>
                <p className="mt-2 text-sm text-slate-500">
                  Welcome aboard, {form.firstName}! Redirecting you to the homepage…
                </p>
              </div>
              <div className="h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full bg-sky-500 rounded-full animate-progress" />
              </div>
            </div>
          </AuthCard>
        </main>
        <Footer />
      </>
    );
  }

  if (step === "otp") {
    return (
      <>
        <Navbar />
        <main className="flex-1">
          <AuthCard
            title="Verify your email"
            subtitle={
              <span>
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-navy-900">{form.email}</span>
                <br />
                <span className="text-xs text-amber-600">(Demo: use code <strong>123456</strong>)</span>
              </span>
            }
          >
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6 animate-fadeUp">
              {/* Email icon */}
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50 border border-sky-100">
                <Mail size={28} className="text-sky-600" />
              </div>

              <OtpInput value={otp} onChange={setOtp} />

              {otpError && (
                <p className="text-center text-sm text-red-500 animate-fadeIn">{otpError}</p>
              )}

              <Button
                type="submit"
                className="w-full rounded-xl"
                disabled={submitting}
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Verifying…
                  </span>
                ) : (
                  "Verify & Create Account"
                )}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => { setStep("form"); setOtp(""); setOtpError(""); }}
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                >
                  ← Change email
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0}
                  className={cn(
                    "flex items-center gap-1.5 font-medium transition-colors",
                    countdown > 0
                      ? "text-slate-400 cursor-not-allowed"
                      : "text-sky-600 hover:text-sky-700"
                  )}
                >
                  <RefreshCw size={13} />
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
                </button>
              </div>
            </form>
          </AuthCard>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <AuthCard
          title="Create your account"
          subtitle="Fill in your details to get started with SkyRoute."
        >
          <form className="flex flex-col gap-5 animate-fadeUp" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="firstName"
                label="First name"
                value={form.firstName}
                onChange={(e) => update("firstName", e.target.value)}
                error={errors.firstName}
              />
              <TextField
                id="lastName"
                label="Surname"
                value={form.lastName}
                onChange={(e) => update("lastName", e.target.value)}
                error={errors.lastName}
              />
            </div>

            <TextField
              id="email"
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              error={errors.email}
            />

            <TextField
              id="birthday"
              label="Date of birth"
              type="date"
              value={form.birthday}
              onChange={(e) => update("birthday", e.target.value)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <PasswordField
                id="password"
                label="Password"
                minLength={8}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                error={errors.password}
              />
              <PasswordField
                id="confirmPassword"
                label="Confirm password"
                minLength={8}
                value={form.confirmPassword}
                onChange={(e) => update("confirmPassword", e.target.value)}
                error={errors.confirmPassword}
              />
            </div>

            {/* Password strength */}
            {form.password && (
              <div className="animate-fadeIn">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((n) => {
                    const strength = Math.min(
                      Math.floor(
                        (form.password.length / 4) +
                        (/[A-Z]/.test(form.password) ? 0.5 : 0) +
                        (/[0-9]/.test(form.password) ? 0.5 : 0) +
                        (/[^A-Za-z0-9]/.test(form.password) ? 1 : 0)
                      ),
                      4
                    );
                    return (
                      <div
                        key={n}
                        className={cn(
                          "h-1.5 flex-1 rounded-full transition-all duration-300",
                          n <= strength
                            ? strength <= 1 ? "bg-red-400" : strength <= 2 ? "bg-amber-400" : strength <= 3 ? "bg-sky-400" : "bg-green-400"
                            : "bg-slate-100"
                        )}
                      />
                    );
                  })}
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Use 8+ characters with uppercase, numbers & symbols for a strong password.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-1">
              <Link href="/login">
                <Button type="button" variant="outline" className="rounded-xl">
                  Back to login
                </Button>
              </Link>
              <Button
                type="button"
                className="flex-1 rounded-xl"
                onClick={handleSendOtp}
                disabled={otpSending}
              >
                {otpSending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Sending code…
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>
        </AuthCard>
      </main>
      <Footer />
    </>
  );
}