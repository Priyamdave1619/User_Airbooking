import { Plane, Clock } from "lucide-react";
import { FlightOffer } from "@/types";
import { findCity } from "@/lib/data/cities";

export function FlightDetailsCard({ flight }: { flight: FlightOffer }) {
  const fromCity = findCity(flight.fromCode);
  const toCity = findCity(flight.toCode);

  return (
    <div className="brand-card p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sky-600">
          <Plane size={18} />
          <span className="text-sm font-bold">{flight.id}</span>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {flight.travelClass}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-navy-900">{flight.departTime}</p>
          <p className="text-sm text-slate-500">
            {fromCity?.name ?? flight.fromCode} ({flight.fromCode})
          </p>
        </div>
        <div className="flex flex-1 flex-col items-center px-4">
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={12} /> {flight.duration}
          </span>
          <div className="my-1 h-px w-full bg-slate-300" />
          <span className="text-xs text-slate-400">{flight.stopLabel}</span>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-navy-900">{flight.arriveTime}</p>
          <p className="text-sm text-slate-500">
            {toCity?.name ?? flight.toCode} ({flight.toCode})
          </p>
        </div>
      </div>
    </div>
  );
}
