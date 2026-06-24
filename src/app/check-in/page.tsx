"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Download, UserCheck } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PnrLookupForm } from "@/components/checkin/PnrLookupForm";
import { FlightDetailsCard } from "@/components/checkin/FlightDetailsCard";
import { BoardingPassCard } from "@/components/checkin/BoardingPassCard";
import { SeatMap } from "@/components/seatmap/SeatMap";
import { SeatLegend } from "@/components/seatmap/SeatLegend";
import { useSeatMap } from "@/hooks/useSeatMap";
import { useSessionId } from "@/hooks/useSessionId";
import { flightOffers } from "@/lib/data/flights";
import { getBooking, saveBooking } from "@/lib/store/db";
import { generateBoardingPassPdf } from "@/lib/pdf/generateBoardingPass";
import { Booking, BoardingPassData, Seat } from "@/types";

type Step = "lookup" | "verify" | "seats" | "confirmed";

function CheckInContent() {
  const params = useSearchParams();
  const sessionId = useSessionId();

  const [step, setStep] = useState<Step>("lookup");
  const [lookupError, setLookupError] = useState<string | undefined>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [activePassengerId, setActivePassengerId] = useState<string | null>(null);
  const [boardingPasses, setBoardingPasses] = useState<BoardingPassData[]>([]);

  const flight = booking
    ? flightOffers.find((f) => f.id === booking.flightId) ?? null
    : null;

  const ownedSeatIds = useMemo(
    () => (booking ? booking.passengers.map((p) => p.seatId).filter((id): id is string => Boolean(id)) : []),
    [booking]
  );

  const { seats, selectSeat, deselectSeat } = useSeatMap({
    flightId: flight?.id ?? "none",
    aircraft: flight?.segments[0]?.aircraft ?? "Boeing 777",
    sessionId,
    ownedSeatIds,
  });

  function handleLookup(pnr: string, lastName: string) {
    const found = getBooking(pnr);
    if (!found) {
      setLookupError("We couldn't find a booking with that reference. Double check the PNR and try again.");
      return;
    }
    if (found.status === "pending_payment") {
      setLookupError("This booking hasn't been paid for yet. Complete payment before checking in.");
      return;
    }
    const passengerMatch = found.passengers.some((p) =>
      p.fullName.toLowerCase().includes(lastName.toLowerCase())
    );
    if (lastName && !passengerMatch) {
      setLookupError("That name doesn't match any passenger on this booking.");
      return;
    }
    setLookupError(undefined);
    setBooking(found);
    setActivePassengerId(found.passengers[0]?.id ?? null);
    setStep("verify");
  }

  function handleSeatToggle(seat: Seat) {
    if (!booking || !flight || !activePassengerId) return;
    const passenger = booking.passengers.find((p) => p.id === activePassengerId);
    if (!passenger) return;

    if (seat.status === "selected" && seat.id === passenger.seatId) {
      // Deselecting own current seat isn't allowed without picking a
      // replacement — a checked-in flow always needs an assigned seat.
      return;
    }
    if (seat.status !== "available") return;

    if (passenger.seatId) {
      deselectSeat(passenger.seatId);
    }
    selectSeat(seat.id);

    const updatedPassengers = booking.passengers.map((p) =>
      p.id === passenger.id ? { ...p, seatId: seat.id } : p
    );
    const updatedBooking = { ...booking, passengers: updatedPassengers };
    saveBooking(updatedBooking);
    setBooking(updatedBooking);
  }

  function handleConfirmCheckIn() {
    if (!booking || !flight) return;

    const updatedPassengers = booking.passengers.map((p) => ({ ...p, checkedIn: true }));
    const updatedBooking: Booking = { ...booking, passengers: updatedPassengers, status: "checked_in" };
    saveBooking(updatedBooking);
    setBooking(updatedBooking);

    const passes: BoardingPassData[] = updatedPassengers.map((p, index) => {
      const seat = seats.find((s) => s.id === p.seatId);
      return {
        pnr: booking.pnr,
        passengerName: p.fullName,
        flightId: flight.id,
        fromCode: flight.fromCode,
        toCode: flight.toCode,
        seatLabel: seat?.label ?? "—",
        travelClass: flight.travelClass,
        gate: `G${(flight.id.length % 9) + 1}`,
        boardingTime: flight.departTime,
        departTime: flight.departTime,
        seq: index + 1,
      };
    });
    setBoardingPasses(passes);
    setStep("confirmed");
  }

  const allPassengersSeated = booking?.passengers.every((p) => p.seatId) ?? false;

  if (step === "lookup") {
    return (
      <Container className="py-16">
        <PnrLookupForm
          onSubmit={handleLookup}
          error={lookupError}
          initialPnr={params.get("pnr") ?? ""}
        />
      </Container>
    );
  }

  if (!booking || !flight) {
    return (
      <Container className="py-16 text-center text-slate-500">Booking unavailable.</Container>
    );
  }

  if (step === "verify") {
    return (
      <Container className="max-w-3xl py-16">
        <div className="brand-card p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-2 text-emerald-600">
            <UserCheck size={20} />
            <span className="text-sm font-bold uppercase tracking-wide">Booking verified</span>
          </div>
          <FlightDetailsCard flight={flight} />

          <h3 className="mt-6 text-sm font-bold uppercase tracking-wide text-slate-500">
            Passengers on this booking
          </h3>
          <div className="mt-3 flex flex-col gap-2">
            {booking.passengers.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm"
              >
                <span className="font-semibold text-navy-900">{p.fullName}</span>
                <span className="text-slate-500">
                  {p.seatId ? `Seat ${p.seatId}` : "No seat assigned"}
                </span>
              </div>
            ))}
          </div>

          <Button className="mt-6 w-full" size="lg" onClick={() => setStep("seats")}>
            Continue to seat selection
          </Button>
        </div>
      </Container>
    );
  }

  if (step === "seats") {
    return (
      <Container className="py-10">
        <div className="brand-card mb-6 flex flex-wrap items-center justify-between gap-3 p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              Confirm or change seats
            </p>
            <h1 className="text-xl font-bold text-navy-900">{flight.id} · {flight.travelClass}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            {booking.passengers.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePassengerId(p.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  activePassengerId === p.id
                    ? "bg-sky-500 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p.fullName.split(" ")[0]} {p.seatId ? `· ${p.seatId}` : ""}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <SeatLegend />
          <SeatMap
            seats={seats}
            aircraft={flight.segments[0]?.aircraft ?? "Boeing 777"}
            maxSelectable={booking.passengers.length}
            selectedCount={ownedSeatIds.length}
            onToggleSeat={handleSeatToggle}
          />
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {ownedSeatIds.length} of {booking.passengers.length} passengers seated
          </p>
          <Button size="lg" disabled={!allPassengersSeated} onClick={handleConfirmCheckIn}>
            Confirm check-in
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="max-w-3xl py-16">
      <div className="mb-8 text-center">
        <CheckCircle2 className="mx-auto text-emerald-500" size={56} strokeWidth={1.5} />
        <h1 className="mt-3 text-2xl font-bold text-navy-900">You&apos;re checked in</h1>
        <p className="mt-1 text-slate-500">
          Boarding passes are ready below. Arrive at the gate at least 30 minutes before
          boarding time.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {boardingPasses.map((pass) => (
          <div key={pass.pnr + pass.seatLabel} className="flex flex-col gap-3">
            <BoardingPassCard pass={pass} />
            <Button
              variant="outline"
              className="w-fit self-end"
              onClick={() => generateBoardingPassPdf(pass)}
            >
              <Download size={16} /> Download boarding pass (PDF)
            </Button>
          </div>
        ))}
      </div>
    </Container>
  );
}

export default function CheckInPage() {
  return (
    <PageShell>
      <div className="bg-slate-50">
        <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading…</div>}>
          <CheckInContent />
        </Suspense>
      </div>
    </PageShell>
  );
}
