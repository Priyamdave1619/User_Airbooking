"use client";

import { Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalletFormProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

const wallets = [
  { id: "paytm", label: "Paytm Wallet", balance: 4250 },
  { id: "amazonpay", label: "Amazon Pay", balance: 1899 },
  { id: "mobikwik", label: "MobiKwik", balance: 760 },
  { id: "freecharge", label: "Freecharge", balance: 2100 },
];

export function WalletForm({ value, onChange, error }: WalletFormProps) {
  return (
    <div className="flex flex-col gap-3">
      {wallets.map((wallet) => {
        const active = value === wallet.id;
        return (
          <button
            key={wallet.id}
            type="button"
            onClick={() => onChange(wallet.id)}
            className={cn(
              "flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-colors",
              active ? "border-sky-500 bg-sky-50" : "border-slate-200 hover:border-slate-300"
            )}
          >
            <div className="flex items-center gap-3">
              <Wallet className={active ? "text-sky-600" : "text-slate-400"} size={22} />
              <span className="font-semibold text-navy-900">{wallet.label}</span>
            </div>
            <span className="text-sm text-slate-500">
              Balance: INR {wallet.balance.toLocaleString("en-IN")}
            </span>
          </button>
        );
      })}
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
}
