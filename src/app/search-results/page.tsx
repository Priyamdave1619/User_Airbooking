"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { FlightResultCard } from "@/components/booking/FlightResultCard";
import { flightOffers } from "@/lib/data/flights";
import { findCity } from "@/lib/data/cities";
import { Plane } from "lucide-react";

function FlightCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="skeleton h-11 w-11 rounded-xl shrink-0" />
        <div className="flex flex-1 items-center gap-4">
          <div className="space-y-1.5">
            <div className="skeleton h-6 w-14 rounded" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="skeleton h-px w-full" />
            <div className="skeleton h-3 w-16 mx-auto rounded" />
          </div>
          <div className="space-y-1.5 text-right">
            <div className="skeleton h-6 w-14 rounded ml-auto" />
            <div className="skeleton h-3 w-20 rounded" />
          </div>
        </div>
        <div className="space-y-1 sm:pl-5 sm:border-l sm:border-slate-100">
          <div className="skeleton h-4 w-24 rounded" />
          <div className="skeleton h-7 w-28 rounded" />
        </div>
      </div>
    </div>
  );
}

function SearchResultsContent() {
  const params = useSearchParams();
  const from = params.get("from") || "AMD";
  const to = params.get("to") || "EWR";
  const depart = params.get("depart");
  const adults = params.get("adults") || "1";
  const fromCity = findCity(from);
  const toCity = findCity(to);

  return (
    <div className="bg-slate-50 py-10 min-h-screen">
      <Container>
        <div className="brand-card mb-8 flex flex-wrap items-center justify-between gap-4 p-6 animate-fadeUp">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600 flex items-center gap-1.5">
              <Plane size={11} className="rotate-45" />
              Available flights
            </p>
            <h1 className="text-2xl font-bold text-navy-900 mt-1">
              {fromCity?.name ?? from} ({from}) → {toCity?.name ?? to} ({to})
            </h1>
            {depart && <p className="text-sm text-slate-500 mt-0.5">Departing {depart} · {adults} adult{Number(adults) > 1 ? "s" : ""}</p>}
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-navy-900">{flightOffers.length}</p>
            <p className="text-sm text-slate-500">fares found</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {flightOffers.map((offer, i) => (
            <div
              key={offer.id}
              className="animate-fadeUp"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <FlightResultCard offer={offer} adults={adults} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="bg-slate-50 py-10 min-h-screen">
      <Container>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 mb-8 shadow-sm">
          <div className="space-y-2">
            <div className="skeleton h-4 w-32 rounded" />
            <div className="skeleton h-7 w-64 rounded" />
            <div className="skeleton h-4 w-48 rounded" />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <FlightCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <PageShell>
      <Suspense fallback={<SearchResultsSkeleton />}>
        <SearchResultsContent />
      </Suspense>
    </PageShell>
  );
}
