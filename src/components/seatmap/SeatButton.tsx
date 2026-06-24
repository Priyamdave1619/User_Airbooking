"use client";
import { Seat } from "@/types";
import { cn } from "@/lib/utils";

const tierColors: Record<string, string> = {
  first: "bg-navy-900 border-navy-800 text-white hover:bg-navy-700",
  business: "bg-purple-400 border-purple-500 text-white hover:bg-purple-500",
  premium: "bg-amber-400 border-amber-500 text-amber-900 hover:bg-amber-500",
  economy: "bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300",
};

const statusOverride: Partial<Record<string, string>> = {
  occupied: "bg-slate-400 border-slate-500 text-white cursor-not-allowed opacity-70",
  locked: "bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed opacity-60 animate-pulse",
  selected: "bg-sky-500 border-sky-600 text-white ring-2 ring-sky-300 ring-offset-1",
};

interface SeatButtonProps {
  seat: Seat;
  onSelect: (seat: Seat) => void;
}

export function SeatButton({ seat, onSelect }: SeatButtonProps) {
  const statusClass = statusOverride[seat.status];
  const tierClass = tierColors[seat.tier] ?? tierColors.economy;
  const isExit = seat.isExitRow && seat.status !== "occupied" && seat.status !== "locked";

  return (
    <button
      className={cn(
        "relative flex h-7 w-7 items-center justify-center rounded-sm border text-[9px] font-bold transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400",
        "sm:h-8 sm:w-8 sm:text-[10px]",
        statusClass ?? (isExit ? "bg-emerald-400 border-emerald-500 text-emerald-900 hover:bg-emerald-500" : tierClass),
        seat.status === "available" || seat.status === "selected" ? "cursor-pointer" : "cursor-not-allowed"
      )}
      onClick={() => onSelect(seat)}
      title={`${seat.label} · ${seat.tier} · ₹${seat.priceInr > 0 ? seat.priceInr.toLocaleString("en-IN") : "Included"}${seat.isExitRow ? " · Exit Row" : ""}${seat.isWindow ? " · Window" : ""}${seat.isAisle ? " · Aisle" : ""}`}
      aria-label={`Seat ${seat.label}, ${seat.status}`}
    >
      {seat.label.replace(/\d+/g, "")}
    </button>
  );
}
