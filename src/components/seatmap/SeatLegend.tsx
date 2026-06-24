export function SeatLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl border border-slate-200 bg-white px-5 py-3">
      {[
        { color: "bg-slate-200 border-slate-300", label: "Available" },
        { color: "bg-sky-500 border-sky-600", label: "Selected" },
        { color: "bg-slate-400 border-slate-500", label: "Occupied" },
        { color: "bg-amber-400 border-amber-500", label: "Premium" },
        { color: "bg-emerald-400 border-emerald-500", label: "Exit Row" },
        { color: "bg-purple-400 border-purple-500", label: "Business" },
        { color: "bg-navy-900 border-navy-800", label: "First Class" },
      ].map(({ color, label }) => (
        <div key={label} className="flex items-center gap-1.5">
          <div className={`h-4 w-4 rounded-sm border ${color}`} />
          <span className="text-[11px] text-slate-500">{label}</span>
        </div>
      ))}
    </div>
  );
}
