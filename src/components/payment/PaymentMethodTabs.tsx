"use client";

import { CreditCard, Smartphone, Landmark, Wallet } from "lucide-react";
import { PaymentMethod } from "@/types";
import { cn } from "@/lib/utils";

interface PaymentMethodTabsProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const methods: { id: PaymentMethod; label: string; icon: typeof CreditCard }[] = [
  { id: "card", label: "Card", icon: CreditCard },
  { id: "upi", label: "UPI", icon: Smartphone },
  { id: "netbanking", label: "Net Banking", icon: Landmark },
  { id: "wallet", label: "Wallet", icon: Wallet },
];

export function PaymentMethodTabs({ value, onChange }: PaymentMethodTabsProps) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
      {methods.map((method) => {
        const Icon = method.icon;
        const active = value === method.id;
        return (
          <button
            key={method.id}
            type="button"
            onClick={() => onChange(method.id)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border-2 px-4 py-4 text-sm font-semibold transition-colors",
              active
                ? "border-sky-500 bg-sky-50 text-sky-700"
                : "border-slate-200 text-slate-500 hover:border-slate-300"
            )}
          >
            <Icon size={22} />
            {method.label}
          </button>
        );
      })}
    </div>
  );
}
