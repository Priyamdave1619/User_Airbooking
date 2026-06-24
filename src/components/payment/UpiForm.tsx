"use client";

import { QrCode } from "lucide-react";
import { TextField } from "@/components/auth/TextField";

interface UpiFormProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const upiApps = ["Google Pay", "PhonePe", "Paytm", "BHIM"];

export function UpiForm({ value, onChange, error }: UpiFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <TextField
        id="upi-id"
        label="UPI ID"
        placeholder="yourname@bank"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
      />

      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs font-semibold text-slate-400">OR SCAN TO PAY</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="flex flex-col items-center gap-3 rounded-2xl bg-slate-50 p-6">
        <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-white shadow-sm">
          <QrCode size={96} className="text-navy-900" />
        </div>
        <p className="text-xs text-slate-500">Scan with any UPI app</p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {upiApps.map((app) => (
          <span
            key={app}
            className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-semibold text-slate-600"
          >
            {app}
          </span>
        ))}
      </div>
    </div>
  );
}
