"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { SeatMap } from "@/components/seatmap/SeatMap";
import { SeatLegend } from "@/components/seatmap/SeatLegend";
import { SeatSelectionSummary } from "@/components/seatmap/SeatSelectionSummary";
import { useSeatMap } from "@/hooks/useSeatMap";
import { useSessionId } from "@/hooks/useSessionId";
import { flightOffers } from "@/lib/data/flights";
import { findCity } from "@/lib/data/cities";
import { releaseAllSeatsFor } from "@/lib/store/db";

function SeatSelectionContent() {
  const router = useRouter();
  const params = useSearchParams();
  const flightId = params.get("flight") ?? flightOffers[0].id;
  const adults = Number(params.get("adults") ?? "1");
  const flight = flightOffers.find((f) => f.id === flightId) ?? flightOffers[0];
  const fromCity = findCity(flight.fromCode);
  const toCity = findCity(flight.toCode);

  const sessionId = useSessionId();
  const { seats, selectSeat, deselectSeat } = useSeatMap({
    flightId: flight.id,
    aircraft: flight.segments[0]?.aircraft ?? "Boeing 777",
    sessionId,
  });

  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const continuingRef = useRef(false);

  useEffect(() => {
    return () => {
      // Release any held-but-unconfirmed seats if the passenger navigates
      // away without completing the booking. If they clicked "Continue",
      // the next page takes ownership of these locks instead — releasing
      // here would open a window for another session to grab the seat.
      if (!continuingRef.current) {
        releaseAllSeatsFor(flight.id, sessionId);
      }
    };
  }, [flight.id, sessionId]);

  function handleToggleSeat(seat: { id: string; status: string }) {
    if (seat.status === "selected") {
      deselectSeat(seat.id);
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.id));
    } else {
      selectSeat(seat.id);
      setSelectedSeatIds((prev) => [...prev, seat.id]);
    }
  }

  function handleRemove(seatId: string) {
    deselectSeat(seatId);
    setSelectedSeatIds((prev) => prev.filter((id) => id !== seatId));
  }

  function handleContinue() {
    continuingRef.current = true;
    const query = new URLSearchParams({
      flight: flight.id,
      adults: String(adults),
      seats: selectedSeatIds.join(","),
    });
    router.push(`/passenger-details?${query.toString()}`);
  }

  return (
    <div className="bg-slate-50 py-10">
      <Container>
        <div className="brand-card mb-8 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              Choose your seats
            </p>
            <h1 className="text-2xl font-bold text-navy-900">
              {fromCity?.name ?? flight.fromCode} &rarr; {toCity?.name ?? flight.toCode}
            </h1>
            <p className="text-sm text-slate-500">
              Flight {flight.id} · {flight.travelClass} · {adults} passenger
              {adults > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="flex flex-col gap-4">
            <SeatLegend />
            <SeatMap
              seats={seats}
              aircraft={flight.segments[0]?.aircraft ?? "Boeing 777"}
              maxSelectable={adults}
              selectedCount={selectedSeatIds.length}
              onToggleSeat={handleToggleSeat}
            />
          </div>

          <SeatSelectionSummary
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            requiredCount={adults}
            basePriceInr={flight.priceInr}
            onRemove={handleRemove}
            onContinue={handleContinue}
          />
        </div>
      </Container>
    </div>
  );
}

export default function SeatSelectionPage() {
  return (
    <PageShell>
      <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading seat map…</div>}>
        <SeatSelectionContent />
      </Suspense>
    </PageShell>
  );
}
