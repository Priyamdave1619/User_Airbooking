"use client";

import { cn } from "@/lib/utils";

interface TripTypeToggleProps {
  value: "one-way" | "round-trip";
  onChange: (value: "one-way" | "round-trip") => void;
}

export function TripTypeToggle({ value, onChange }: TripTypeToggleProps) {
  return (
    <div className="inline-flex rounded-full bg-slate-100 p-1">
      {(["one-way", "round-trip"] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
            value === option
              ? "bg-sky-500 text-white shadow-sm"
              : "text-slate-600 hover:text-sky-600"
          )}
        >
          {option === "one-way" ? "One-way" : "Round-trip"}
        </button>
      ))}
    </div>
  );
}
