"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowLeftRight, Search, MapPin, Calendar, Users, Star } from "lucide-react";
import { cities } from "@/lib/data/cities";
import { Button } from "@/components/ui/Button";
import { TripTypeToggle } from "@/components/booking/TripTypeToggle";
import { cn } from "@/lib/utils";

function FieldWrapper({ label, icon: Icon, children, className }: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("group flex flex-col gap-1", className)}>
      <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-700">
        <Icon size={12} />
        {label}
      </label>
      {children}
    </div>
  );
}

export function BookingSearchCard() {
  const router = useRouter();
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState("1");
  const [children, setChildren] = useState("0");
  const [travelClass, setTravelClass] = useState("Economy class");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams({
      from, to, depart: departDate, tripType, adults, children, class: travelClass,
    });
    if (tripType === "round-trip" && returnDate) params.set("return", returnDate);
    router.push(`/search-results?${params.toString()}`);
  }

  const inputClass = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 transition-all duration-200 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100 hover:border-slate-300 appearance-none";

  return (
    <div className="booking-card animate-scaleIn mx-auto -mt-20 w-full max-w-5xl md:-mt-24">
      {/* Header row */}
      <div className="booking-card-header flex flex-wrap items-center justify-between gap-4 px-6 pt-6 pb-4">
        <TripTypeToggle value={tripType} onChange={setTripType} />
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <Star size={13} className="text-amber-400 fill-amber-400" />
          <span>Search live fares across 17+ cities</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
        {/* Route row */}
        <div className="grid gap-4 sm:grid-cols-2">
          <FieldWrapper label="Flying from" icon={MapPin} className="animate-slideLeft delay-75">
            <div className="relative">
              <select
                id="from"
                required
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className={inputClass}
              >
                <option value="">Select origin city</option>
                {cities.map((city) => (
                  <option key={city.code} value={city.code}>{city.name} ({city.code})</option>
                ))}
              </select>
            </div>
          </FieldWrapper>

          <FieldWrapper label="Flying to" icon={MapPin} className="relative animate-slideRight delay-75">
            <select
              id="to"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className={inputClass}
            >
              <option value="">Select destination city</option>
              {cities.map((city) => (
                <option key={city.code} value={city.code}>{city.name} ({city.code})</option>
              ))}
            </select>
            <button
              type="button"
              aria-label="Swap origin and destination"
              onClick={() => { setFrom(to); setTo(from); }}
              className="absolute -left-6 top-8 z-10 hidden h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-sky-600 text-white shadow-md sm:flex hover:bg-sky-500 hover:scale-110 active:scale-95 transition-all duration-200"
            >
              <ArrowLeftRight size={14} />
            </button>
          </FieldWrapper>
        </div>

        {/* Date row */}
        <div className={cn("grid gap-4 animate-fadeUp delay-150", tripType === "round-trip" ? "sm:grid-cols-2" : "sm:grid-cols-1 max-w-sm")}>
          <FieldWrapper label="Departing" icon={Calendar}>
            <input
              id="depart"
              type="date"
              required
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className={inputClass}
            />
          </FieldWrapper>
          {tripType === "round-trip" && (
            <FieldWrapper label="Return date" icon={Calendar} className="animate-fadeIn">
              <input
                id="return"
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className={inputClass}
              />
            </FieldWrapper>
          )}
        </div>

        {/* Passengers + class */}
        <div className="grid gap-4 sm:grid-cols-3 animate-fadeUp delay-225">
          <FieldWrapper label="Adults (18+)" icon={Users}>
            <select value={adults} onChange={(e) => setAdults(e.target.value)} className={inputClass}>
              {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n} Adult{n > 1 ? "s" : ""}</option>
              ))}
            </select>
          </FieldWrapper>
          <FieldWrapper label="Children (0-17)" icon={Users}>
            <select value={children} onChange={(e) => setChildren(e.target.value)} className={inputClass}>
              {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "Child" : "Children"}</option>
              ))}
            </select>
          </FieldWrapper>
          <FieldWrapper label="Travel class" icon={Star}>
            <select value={travelClass} onChange={(e) => setTravelClass(e.target.value)} className={inputClass}>
              <option>Economy class</option>
              <option>Business class</option>
              <option>First class</option>
            </select>
          </FieldWrapper>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-between gap-4 pt-2 animate-fadeUp delay-300">
          <p className="hidden text-xs text-slate-400 sm:block">
            ✓ No booking fees &nbsp;·&nbsp; ✓ Best price guarantee &nbsp;·&nbsp; ✓ Free cancellation within 24h
          </p>
          <Button type="submit" size="lg" className="rounded-2xl px-8 shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30 transition-shadow w-full sm:w-auto">
            <Search size={18} />
            Search flights
          </Button>
        </div>
      </form>
    </div>
  );
}
