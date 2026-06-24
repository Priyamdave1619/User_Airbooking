import { Plane } from "lucide-react";
import { BoardingPassData } from "@/types";
import { findCity } from "@/lib/data/cities";

export function BoardingPassCard({ pass }: { pass: BoardingPassData }) {
  const fromCity = findCity(pass.fromCode);
  const toCity   = findCity(pass.toCode);

  return (
    <div className="animate-scaleIn overflow-hidden rounded-2xl shadow-xl sm:flex">
      {/* ── Main stub ───────────────────────────────────────────────────────── */}
      <div className="relative flex-1 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-700 p-7 text-white">
        {/* Gradient accent bar */}
        <div className="absolute inset-x-0 top-0 h-[5px] rounded-t-2xl bg-gradient-to-r from-sky-500 to-amber-500" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-bold tracking-widest text-white">SKYROUTE</p>
            <p className="text-[10px] text-white/50 tracking-widest">AIRLINES</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold tracking-widest text-amber-400">BOARDING PASS</p>
          </div>
        </div>

        {/* Route */}
        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-5xl font-black tracking-tight">{pass.fromCode}</p>
            <p className="mt-1 text-xs text-white/60 uppercase tracking-wide">
              {fromCity?.name ?? pass.fromCode}
            </p>
          </div>

          <div className="flex flex-1 flex-col items-center gap-1 px-4">
            <div className="flex w-full items-center gap-1">
              <div className="h-px flex-1 bg-sky-500/40" />
              <Plane size={18} className="shrink-0 rotate-90 text-sky-400" />
              <div className="h-px flex-1 bg-sky-500/40" />
            </div>
            <p className="text-[10px] text-white/40 tracking-widest">NON-STOP</p>
          </div>

          <div className="text-right">
            <p className="text-5xl font-black tracking-tight">{pass.toCode}</p>
            <p className="mt-1 text-xs text-white/60 uppercase tracking-wide">
              {toCity?.name ?? pass.toCode}
            </p>
          </div>
        </div>

        {/* Info grid */}
        <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-4 border-t border-white/10 pt-5 text-xs sm:grid-cols-5">
          {[
            ["PASSENGER", pass.passengerName.toUpperCase()],
            ["PNR",       pass.pnr],
            ["FLIGHT",    pass.flightId],
            ["CLASS",     pass.travelClass],
            ["DEPARTS",   pass.departTime],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-white/50 text-[10px] tracking-wider">{label}</p>
              <p className="mt-0.5 font-bold font-mono text-sm">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Perforation ─────────────────────────────────────────────────────── */}
      <div className="hidden sm:flex flex-col items-center py-4">
        <div className="w-px flex-1 border-l-2 border-dashed border-slate-200" />
        <div className="-mx-2 h-4 w-4 rounded-full bg-slate-100 ring-1 ring-slate-200" />
        <div className="w-px flex-1 border-l-2 border-dashed border-slate-200" />
      </div>

      {/* ── Right stub ──────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-6 border-t border-dashed border-slate-200 bg-slate-50 px-6 py-5 sm:w-44 sm:flex-col sm:items-start sm:border-l sm:border-t-0 sm:py-7">
        <div>
          <p className="text-[10px] text-slate-400 tracking-widest">SEAT</p>
          <p className="text-3xl font-black text-amber-500">{pass.seatLabel}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 tracking-widest">GATE</p>
          <p className="text-lg font-bold text-navy-900">{pass.gate}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 tracking-widest">BOARDING</p>
          <p className="font-bold text-navy-900">{pass.boardingTime}</p>
        </div>
        <div>
          <p className="text-[10px] text-slate-400 tracking-widest">SEQ</p>
          <p className="font-bold text-navy-900">{String(pass.seq).padStart(3, "0")}</p>
        </div>
      </div>
    </div>
  );
}
