"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { createOtp, verifyOtp, canResendOtp } from "@/lib/store/db";
import { toast } from "@/components/ui/Toast";
import type { OtpPurpose } from "@/types";
import {
  Mail, Smartphone, ShieldCheck, CheckCircle,
  RefreshCw, AlertCircle, Clock,
} from "lucide-react";

const OTP_EXPIRY_SECS = 600; // 10 min
const RESEND_COOLDOWN = 60;

const PURPOSE_CONFIG: Record<OtpPurpose, { label: string; icon: React.ElementType; description: string }> = {
  registration: {
    label: "Registration Verification",
    icon: Mail,
    description: "We've sent a verification code to confirm your registration.",
  },
  password_reset: {
    label: "Password Reset",
    icon: ShieldCheck,
    description: "Enter the OTP to reset your password securely.",
  },
  email_verification: {
    label: "Email Verification",
    icon: Mail,
    description: "Verify your email address to secure your account.",
  },
  mobile_verification: {
    label: "Mobile Verification",
    icon: Smartphone,
    description: "Verify your mobile number to enable SMS notifications.",
  },
};

function OtpInput({ onComplete }: { onComplete: (code: string) => void }) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(idx: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    if (digit && idx < 5) refs.current[idx + 1]?.focus();
    const full = next.join("");
    if (full.length === 6) onComplete(full);
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const next = [...digits];
    for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
    setDigits(next);
    refs.current[Math.min(pasted.length, 5)]?.focus();
    if (pasted.length === 6) onComplete(pasted);
  }

  return (
    <div className="flex justify-center gap-3" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="h-14 w-11 rounded-xl border-2 border-slate-200 bg-white text-center text-xl font-bold text-navy-900
            focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 transition
            sm:h-16 sm:w-14"
        />
      ))}
    </div>
  );
}

function OtpVerificationContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAuth();

  const purpose = (params.get("purpose") ?? "email_verification") as OtpPurpose;
  const target = params.get("target") ?? user?.email ?? "";
  const redirectTo = params.get("redirect") ?? "/profile";

  const [demoCode, setDemoCode] = useState("");
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [expiryLeft, setExpiryLeft] = useState(OTP_EXPIRY_SECS);
  const config = PURPOSE_CONFIG[purpose] ?? PURPOSE_CONFIG.email_verification;
  const Icon = config.icon;

  // Send OTP on mount
  useEffect(() => {
    const rec = createOtp(purpose, target);
    setDemoCode(rec.code); // Demo: show code in UI
    setResendCooldown(RESEND_COOLDOWN);
    toast.info(`OTP sent to ${target}`);
  }, [purpose, target]);

  // Expiry timer
  useEffect(() => {
    if (expiryLeft <= 0) return;
    const t = setInterval(() => setExpiryLeft((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, [expiryLeft]);

  // Resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  function handleComplete(code: string) {
    if (expiryLeft === 0) { setErrorMsg("OTP has expired. Please request a new one."); return; }
    setStatus("verifying");
    setErrorMsg("");
    setTimeout(() => {
      const result = verifyOtp(purpose, target, code);
      if (result === "ok") {
        setStatus("success");
        toast.success("Verification successful!");
        setTimeout(() => router.push(redirectTo), 1500);
      } else {
        setStatus("error");
        const msgs: Record<string, string> = {
          expired: "OTP has expired. Please resend.",
          invalid: "Incorrect OTP. Please try again.",
          max_attempts: "Too many incorrect attempts. Please request a new OTP.",
        };
        setErrorMsg(msgs[result] ?? "Verification failed.");
      }
    }, 800);
  }

  function handleResend() {
    if (!canResendOtp(purpose, target)) return;
    const rec = createOtp(purpose, target);
    setDemoCode(rec.code);
    setResendCooldown(RESEND_COOLDOWN);
    setExpiryLeft(OTP_EXPIRY_SECS);
    setStatus("idle");
    setErrorMsg("");
    toast.success("New OTP sent!");
  }

  const mins = Math.floor(expiryLeft / 60);
  const secs = expiryLeft % 60;

  return (
    <div className="bg-slate-50 py-10">
      <Container>
        <div className="mx-auto max-w-md">
          {status === "success" ? (
            <div className="brand-card flex flex-col items-center gap-6 py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle size={40} className="text-emerald-500" />
              </div>
              <div>
                <p className="text-xl font-bold text-navy-900">Verified!</p>
                <p className="text-sm text-slate-500">Redirecting you now…</p>
              </div>
            </div>
          ) : (
            <div className="brand-card p-8">
              {/* Header */}
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50">
                  <Icon size={28} className="text-sky-500" />
                </div>
                <h1 className="text-xl font-bold text-navy-900">{config.label}</h1>
                <p className="mt-1 text-sm text-slate-500">{config.description}</p>
                <p className="mt-3 text-sm">
                  <span className="text-slate-500">Sent to </span>
                  <span className="font-semibold text-navy-900">{target}</span>
                </p>
              </div>

              {/* Demo OTP display */}
              {demoCode && (
                <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-center">
                  <p className="text-xs text-amber-600">Demo Mode – Your OTP</p>
                  <p className="mt-1 font-mono text-2xl font-bold tracking-widest text-amber-700">
                    {demoCode}
                  </p>
                </div>
              )}

              {/* OTP Input */}
              <div className="mb-6">
                <OtpInput onComplete={handleComplete} />
              </div>

              {/* Status feedback */}
              {status === "verifying" && (
                <div className="mb-4 flex items-center justify-center gap-2 text-sm text-sky-600">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent" />
                  Verifying…
                </div>
              )}

              {errorMsg && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle size={14} />
                  {errorMsg}
                </div>
              )}

              {/* Expiry */}
              <div className="mb-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                <Clock size={13} />
                {expiryLeft > 0 ? (
                  <span>Expires in <strong className={expiryLeft < 60 ? "text-red-500" : "text-navy-900"}>
                    {mins}:{String(secs).padStart(2, "0")}
                  </strong></span>
                ) : (
                  <span className="text-red-500 font-medium">OTP expired</span>
                )}
              </div>

              {/* Resend */}
              <div className="text-center">
                <p className="text-sm text-slate-500">Didn&apos;t receive the code?</p>
                {resendCooldown > 0 ? (
                  <p className="mt-1 text-sm text-slate-400">
                    Resend in <strong>{resendCooldown}s</strong>
                  </p>
                ) : (
                  <button
                    onClick={handleResend}
                    className="mt-1 flex items-center gap-1.5 mx-auto text-sm font-semibold text-sky-600 hover:text-sky-700"
                  >
                    <RefreshCw size={13} />
                    Resend OTP
                  </button>
                )}
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 text-center">
                <button
                  onClick={() => router.back()}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ← Go back
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default function OtpVerificationPage() {
  return (
    <PageShell>
      <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading…</div>}>
        <OtpVerificationContent />
      </Suspense>
    </PageShell>
  );
}
