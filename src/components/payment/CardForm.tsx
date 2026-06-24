"use client";

import { useState } from "react";
import { TextField } from "@/components/auth/TextField";

export interface CardFormValue {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

interface CardFormProps {
  value: CardFormValue;
  onChange: (value: CardFormValue) => void;
  errors: Partial<Record<keyof CardFormValue, string>>;
}

function detectBrand(number: string): string {
  const digits = number.replace(/\s/g, "");
  if (/^4/.test(digits)) return "Visa";
  if (/^5[1-5]/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^6/.test(digits)) return "RuPay";
  return "";
}

function formatCardNumber(input: string) {
  const digits = input.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(.{4})/g, "$1 ").trim();
}

function formatExpiry(input: string) {
  const digits = input.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export function CardForm({ value, onChange, errors }: CardFormProps) {
  const [focusField, setFocusField] = useState<keyof CardFormValue | null>(null);
  const brand = detectBrand(value.number);

  return (
    <div className="flex flex-col gap-5">
      <div
        className={`relative h-44 w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-sky-700 p-5 text-white shadow-lg transition-transform ${
          focusField === "cvv" ? "scale-[0.98]" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-white/70">SkyRoute Pay</span>
          {brand && <span className="text-sm font-bold">{brand}</span>}
        </div>
        <p className="mt-8 font-mono text-xl tracking-widest">
          {value.number || "•••• •••• •••• ••••"}
        </p>
        <div className="mt-6 flex items-end justify-between text-xs">
          <div>
            <p className="text-white/60">Card holder</p>
            <p className="font-semibold uppercase">{value.name || "FULL NAME"}</p>
          </div>
          <div>
            <p className="text-white/60">Expires</p>
            <p className="font-semibold">{value.expiry || "MM/YY"}</p>
          </div>
        </div>
      </div>

      <TextField
        id="card-number"
        label="Card number"
        inputMode="numeric"
        placeholder="1234 5678 9012 3456"
        value={value.number}
        onFocus={() => setFocusField("number")}
        onChange={(e) => onChange({ ...value, number: formatCardNumber(e.target.value) })}
        error={errors.number}
      />
      <TextField
        id="card-name"
        label="Name on card"
        placeholder="As printed on card"
        value={value.name}
        onFocus={() => setFocusField("name")}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
        error={errors.name}
      />
      <div className="grid grid-cols-2 gap-4">
        <TextField
          id="card-expiry"
          label="Expiry"
          placeholder="MM/YY"
          inputMode="numeric"
          value={value.expiry}
          onFocus={() => setFocusField("expiry")}
          onChange={(e) => onChange({ ...value, expiry: formatExpiry(e.target.value) })}
          error={errors.expiry}
        />
        <TextField
          id="card-cvv"
          label="CVV"
          placeholder="123"
          inputMode="numeric"
          type="password"
          maxLength={4}
          value={value.cvv}
          onFocus={() => setFocusField("cvv")}
          onBlur={() => setFocusField(null)}
          onChange={(e) => onChange({ ...value, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
          error={errors.cvv}
        />
      </div>
    </div>
  );
}
