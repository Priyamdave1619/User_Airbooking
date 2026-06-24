"use client";

import { Select } from "@/components/ui/Select";

interface NetBankingFormProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const banks = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Punjab National Bank",
  "Kotak Mahindra Bank",
  "Bank of Baroda",
  "Yes Bank",
];

export function NetBankingForm({ value, onChange, error }: NetBankingFormProps) {
  return (
    <div className="flex flex-col gap-5">
      <Select
        id="bank"
        label="Select your bank"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Choose a bank</option>
        {banks.map((bank) => (
          <option key={bank} value={bank}>
            {bank}
          </option>
        ))}
      </Select>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      <p className="rounded-xl bg-slate-50 p-4 text-xs text-slate-500">
        You&apos;ll be redirected to your bank&apos;s secure login page to complete this
        payment, then returned here automatically.
      </p>
    </div>
  );
}
