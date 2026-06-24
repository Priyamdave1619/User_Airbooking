"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/Toast";
import {
  KeyRound, Eye, EyeOff, Shield, CheckCircle,
  XCircle, AlertCircle,
} from "lucide-react";

interface StrengthRule {
  label: string;
  test: (p: string) => boolean;
}

const RULES: StrengthRule[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Uppercase letter (A–Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter (a–z)", test: (p) => /[a-z]/.test(p) },
  { label: "Number (0–9)", test: (p) => /\d/.test(p) },
  { label: "Special character (!@#$…)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getStrengthLabel(score: number): { label: string; color: string; bgColor: string } {
  if (score <= 1) return { label: "Very Weak", color: "text-red-600", bgColor: "bg-red-500" };
  if (score === 2) return { label: "Weak", color: "text-orange-500", bgColor: "bg-orange-400" };
  if (score === 3) return { label: "Fair", color: "text-amber-500", bgColor: "bg-amber-400" };
  if (score === 4) return { label: "Strong", color: "text-sky-600", bgColor: "bg-sky-500" };
  return { label: "Very Strong", color: "text-emerald-600", bgColor: "bg-emerald-500" };
}

function PasswordField({
  label, value, onChange, placeholder, show, onToggle,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; show: boolean; onToggle: () => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "••••••••"}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-11 text-sm
            focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100 transition"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  const { user, changePassword } = useAuth();
  const router = useRouter();
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const passedRules = RULES.filter((r) => r.test(newPass));
  const strength = passedRules.length;
  const strengthInfo = getStrengthLabel(strength);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!current) { setError("Please enter your current password."); return; }
    if (newPass.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (newPass !== confirm) { setError("Passwords do not match."); return; }
    if (strength < 3) { setError("Please choose a stronger password."); return; }

    setIsLoading(true);
    setTimeout(() => {
      const ok = changePassword(current, newPass);
      setIsLoading(false);
      if (ok) {
        setSuccess(true);
        setCurrent(""); setNewPass(""); setConfirm("");
        toast.success("Password changed successfully!");
      } else {
        setError("Current password is incorrect.");
      }
    }, 900);
  }

  if (!user) return null;

  return (
    <PageShell>
      <div className="bg-slate-50 py-10">
        <Container>
          <div className="mx-auto max-w-lg">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Account Security</p>
              <h1 className="text-2xl font-bold text-navy-900">Change Password</h1>
              <p className="text-sm text-slate-500">Keep your account secure with a strong password</p>
            </div>

            {success ? (
              <div className="brand-card flex flex-col items-center gap-5 py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle size={32} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-lg font-bold text-navy-900">Password Updated!</p>
                  <p className="text-sm text-slate-500">Your password has been changed successfully.</p>
                </div>
                <Button onClick={() => setSuccess(false)} variant="outline">
                  Change Again
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="brand-card p-8">
                {/* Security notice */}
                <div className="mb-6 flex items-start gap-3 rounded-xl bg-sky-50 p-4">
                  <Shield size={18} className="mt-0.5 text-sky-500 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-sky-800">Security Notice</p>
                    <p className="text-xs text-sky-600">
                      After changing your password, you will remain logged in on this device.
                      Other sessions will be invalidated.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  {/* Current password */}
                  <PasswordField
                    label="Current Password"
                    value={current}
                    onChange={setCurrent}
                    show={showCurrent}
                    onToggle={() => setShowCurrent((v) => !v)}
                  />

                  <div className="h-px bg-slate-100" />

                  {/* New password */}
                  <PasswordField
                    label="New Password"
                    value={newPass}
                    onChange={setNewPass}
                    placeholder="Min. 8 characters"
                    show={showNew}
                    onToggle={() => setShowNew((v) => !v)}
                  />

                  {/* Strength meter */}
                  {newPass.length > 0 && (
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-xs text-slate-500">Password Strength</p>
                        <p className={`text-xs font-bold ${strengthInfo.color}`}>
                          {strengthInfo.label}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength ? strengthInfo.bgColor : "bg-slate-200"}`}
                          />
                        ))}
                      </div>

                      {/* Rules checklist */}
                      <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                        {RULES.map((rule) => {
                          const passed = rule.test(newPass);
                          return (
                            <div key={rule.label} className={`flex items-center gap-1.5 text-xs ${passed ? "text-emerald-600" : "text-slate-400"}`}>
                              {passed ? <CheckCircle size={11} /> : <XCircle size={11} />}
                              {rule.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Confirm password */}
                  <PasswordField
                    label="Confirm New Password"
                    value={confirm}
                    onChange={setConfirm}
                    show={showConfirm}
                    onToggle={() => setShowConfirm((v) => !v)}
                  />

                  {/* Match indicator */}
                  {confirm.length > 0 && (
                    <div className={`flex items-center gap-2 text-xs font-medium ${newPass === confirm ? "text-emerald-600" : "text-red-500"}`}>
                      {newPass === confirm ? (
                        <><CheckCircle size={12} /> Passwords match</>
                      ) : (
                        <><XCircle size={12} /> Passwords do not match</>
                      )}
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                      <AlertCircle size={15} />
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full mt-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Updating Password…
                      </span>
                    ) : (
                      <>
                        <KeyRound size={15} />
                        Update Password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Container>
      </div>
    </PageShell>
  );
}
