"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronDown, Luggage, Briefcase, Armchair, ShieldCheck, Sparkles,
  RotateCcw, Plane, Clock, Wifi,
} from "lucide-react";
import { FlightOffer } from "@/types";
import { findCity } from "@/lib/data/cities";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const fareDetailItems = (offer: FlightOffer) => [
  { icon: Luggage, label: "Check-in baggage", value: offer.baggage },
  { icon: Briefcase, label: "Hand baggage", value: offer.handBaggage },
  { icon: Armchair, label: "Seat selection", value: offer.seatSelection },
  { icon: Sparkles, label: "Upgrade to First", value: offer.upgradeToFirst },
  { icon: ShieldCheck, label: "Change fee", value: offer.changeFee },
  { icon: RotateCcw, label: "Refund fee", value: offer.refundFee },
];

const classBadgeColor: Record<string, string> = {
  "Economy": "bg-slate-100 text-slate-700",
  "Business": "bg-amber-100 text-amber-700",
  "First": "bg-sky-100 text-sky-700",
};

export function FlightResultCard({ offer, adults = "1" }: { offer: FlightOffer; adults?: string }) {
  const [expanded, setExpanded] = useState(false);
  const fromCity = findCity(offer.fromCode);
  const toCity = findCity(offer.toCode);
  const classLabel = offer.travelClass?.split(" ")[0] ?? "Economy";
  const badgeClass = classBadgeColor[classLabel] ?? classBadgeColor["Economy"];

  return (
    <div
      className={cn(
        "group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300",
        expanded
          ? "border-sky-200 shadow-md shadow-sky-100"
          : "border-slate-200 hover:border-slate-300 hover:shadow-md"
      )}
    >
      {/* Main row — clickable */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left"
      >
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-0">
          {/* Airline logo placeholder */}
          <div className="flex items-center gap-3 sm:w-16 sm:shrink-0 sm:flex-col sm:gap-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-sky-700 shadow-sm">
              <Plane size={18} className="text-white rotate-45" />
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:block">SkyRoute</span>
          </div>

          {/* Route + times */}
          <div className="flex flex-1 items-center gap-4 sm:px-4">
            <div className="text-left">
              <p className="text-xl font-bold text-navy-900 tabular-nums">{offer.departTime}</p>
              <p className="text-sm font-semibold text-slate-700">{offer.fromCode}</p>
              <p className="text-xs text-slate-400 max-w-[80px] truncate">{fromCity?.name ?? offer.fromCode}</p>
            </div>

            <div className="flex flex-1 flex-col items-center gap-1 px-2">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Clock size={11} />
                <span>{offer.duration}</span>
              </div>
              <div className="relative w-full">
                <div className="h-px w-full bg-gradient-to-r from-sky-200 via-sky-400 to-sky-200" />
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                  <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                </div>
                <Plane
                  size={14}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-sky-500 rotate-90"
                />
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  <div className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium underline decoration-dashed underline-offset-2">
                {offer.stopLabel}
              </span>
            </div>

            <div className="text-right">
              <p className="text-xl font-bold text-navy-900 tabular-nums">{offer.arriveTime}</p>
              <p className="text-sm font-semibold text-slate-700">{offer.toCode}</p>
              <p className="text-xs text-slate-400 max-w-[80px] truncate text-right">{toCity?.name ?? offer.toCode}</p>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-3 sm:border-t-0 sm:border-l sm:border-slate-100 sm:pt-0 sm:pl-5 sm:min-w-[180px] sm:flex-col sm:items-end sm:gap-1">
            <div className="text-right">
              <div className={cn("mb-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold", badgeClass)}>
                {offer.travelClass}
              </div>
              <p className="text-xs text-slate-400">per person from</p>
              <p className="text-2xl font-bold text-navy-900 tabular-nums">
                ₹{offer.priceInr.toLocaleString("en-IN")}
              </p>
            </div>

            <div className="flex items-center gap-2 text-sky-600">
              <span className="hidden text-xs font-medium sm:block">
                {expanded ? "Hide details" : "View details"}
              </span>
              <ChevronDown
                size={18}
                className={cn("transition-transform duration-300", expanded && "rotate-180")}
              />
            </div>
          </div>
        </div>

        {/* Flight numbers strip */}
        <div className="flex items-center gap-2 border-t border-slate-100 px-5 py-2">
          {offer.segments.map((seg) => (
            <Badge key={seg.flightNumber} tone="slate">{seg.flightNumber}</Badge>
          ))}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-slate-400">
            <Wifi size={11} />
            <span>Wi-Fi available</span>
          </div>
        </div>
      </button>

      {/* Expanded fare details */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-400 ease-in-out",
          expanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="border-t border-sky-100 bg-gradient-to-b from-sky-50/60 to-slate-50/80 p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-sky-600">{offer.travelClass}</p>
              <h4 className="text-lg font-bold text-navy-900">{offer.fareName}</h4>
            </div>
            <p className="text-xs text-slate-400 font-medium">What's included in this fare</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {fareDetailItems(offer).map((item, i) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-xl border border-white bg-white p-3.5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50">
                  <item.icon className="text-sky-600" size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400">{item.label}</p>
                  <p className="text-sm font-semibold text-navy-900 truncate">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-sky-100 pt-5">
            <div>
              <p className="text-xs text-slate-400">Total for {adults} adult{Number(adults) > 1 ? "s" : ""}</p>
              <p className="text-2xl font-bold text-navy-900 tabular-nums">
                ₹{(offer.priceInr * Number(adults)).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl">Select fare</Button>
              <Link href={`/seat-selection?flight=${offer.id}&adults=${adults}`}>
                <Button variant="dark" className="rounded-xl shadow-sm">Book Now →</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
