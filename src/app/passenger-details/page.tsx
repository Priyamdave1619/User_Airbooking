"use client";

import { Suspense, FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PassengerRow, PassengerData } from "@/components/booking/PassengerRow";
import { flightOffers } from "@/lib/data/flights";
import { findCity } from "@/lib/data/cities";
import { buildSeatMap } from "@/lib/store/seatMapGenerator";
import {
  clearLocksForSeats,
  generatePnr,
  saveBooking,
} from "@/lib/store/db";
import { Booking, BookingPassenger } from "@/types";
import { useSessionId } from "@/hooks/useSessionId";

function createPassenger(seatId: string | null): PassengerData & { seatId: string | null } {
  return {
    id: Math.random().toString(36).slice(2),
    fullName: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    seniorCitizen: false,
    seatId,
  };
}

function PassengerDetailsContent() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = useSessionId();

  const flightId = params.get("flight");
  const flight = flightOffers.find((f) => f.id === flightId) ?? flightOffers[0];
  const fromCity = findCity(flight.fromCode);

  const seatIds = useMemo(
    () => (params.get("seats") ?? "").split(",").filter(Boolean),
    [params]
  );
  const adults = Number(params.get("adults") ?? String(Math.max(seatIds.length, 1)));

  const seatMap = useMemo(
    () => buildSeatMap(flight.id, flight.segments[0]?.aircraft ?? "Boeing 777"),
    [flight.id, flight.segments]
  );

  const seatLookup = (id: string) => seatMap.find((s) => s.id === id);

  const initialPassengers = useMemo<(PassengerData & { seatId: string | null })[]>(() => {
    const count = Math.max(adults, seatIds.length, 1);
    return Array.from({ length: count }, (_, i) => createPassenger(seatIds[i] ?? null));
  }, [adults, seatIds]);

  const [passengers, setPassengers] = useState(initialPassengers);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updatePassenger(id: string, patch: Partial<PassengerData>) {
    setPassengers((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  const seatSurcharge = passengers.reduce((sum, p) => {
    const seat = p.seatId ? seatLookup(p.seatId) : null;
    return sum + (seat?.priceInr ?? 0);
  }, 0);
  const totalAmount = flight.priceInr * passengers.length + seatSurcharge;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const incomplete = passengers.some((p) => !p.fullName || !p.phone || !p.email || !p.age || !p.gender);
    if (incomplete) {
      setError("Please complete every field for each passenger before continuing.");
      return;
    }

    setSubmitting(true);

    const pnr = generatePnr();
    const bookingPassengers: BookingPassenger[] = passengers.map((p) => ({
      id: p.id,
      fullName: p.fullName,
      phone: p.phone,
      email: p.email,
      age: p.age,
      gender: p.gender,
      seniorCitizen: p.seniorCitizen,
      seatId: p.seatId ?? null,
      checkedIn: false,
    }));

    const booking: Booking = {
      pnr,
      flightId: flight.id,
      passengers: bookingPassengers,
      status: "pending_payment",
      contactEmail: passengers[0]?.email ?? "",
      contactPhone: passengers[0]?.phone ?? "",
      createdAt: Date.now(),
      totalAmount,
      transactionId: null,
    };

    saveBooking(booking);

    // Convert the temporary seat holds into a real booking — the seats are
    // now "occupied" because a Booking record references them, so we can
    // release the underlying lock rows.
    const assignedSeatIds = bookingPassengers
      .map((p) => p.seatId)
      .filter((id): id is string => Boolean(id));
    clearLocksForSeats(flight.id, assignedSeatIds);
    void sessionId;

    router.push(`/payment?booking=${pnr}`);
  }

  return (
    <div className="bg-slate-50 py-10">
      <div className="bg-gradient-to-r from-red-600 to-orange-500 py-10 text-center text-white">
        <h1 className="text-2xl font-bold sm:text-3xl">Enter the Passenger Details</h1>
        <p className="mt-2 text-sm text-white/80">
          {fromCity?.name ?? flight.fromCode} ({flight.fromCode}) &rarr; {flight.toCode} ·{" "}
          {flight.travelClass} · {flight.fareName}
        </p>
      </div>

      <Container className="-mt-6 max-w-5xl">
        <div className="brand-card mb-8 grid gap-4 p-6 text-sm sm:grid-cols-3 lg:grid-cols-5">
          <div>
            <p className="text-xs text-slate-500">Flight</p>
            <p className="font-semibold text-navy-900">{flight.id}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Class</p>
            <p className="font-semibold text-navy-900">{flight.travelClass}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">From</p>
            <p className="font-semibold text-navy-900">{flight.fromCode}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">To</p>
            <p className="font-semibold text-navy-900">{flight.toCode}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Total</p>
            <p className="font-semibold text-navy-900">
              INR {totalAmount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-amber-100 p-4 text-sm text-amber-800">
          <strong>Read carefully:</strong> For domestic travel, enter your name exactly
          as it appears on a valid photo ID. For international travel, use the complete
          name as printed on your passport.
        </div>

        {error && (
          <div className="mt-4 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          {passengers.map((passenger, index) => {
            const seat = passenger.seatId ? seatLookup(passenger.seatId) : null;
            return (
              <div key={passenger.id} className="flex flex-col gap-2">
                {seat && (
                  <div className="flex w-fit items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
                    Seat {seat.label}
                    {seat.priceInr > 0 && (
                      <span className="text-sky-500">
                        +INR {seat.priceInr.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                )}
                <PassengerRow
                  index={index}
                  passenger={passenger}
                  onChange={updatePassenger}
                  onRemove={() => {}}
                  removable={false}
                />
              </div>
            );
          })}

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {passengers.length} passenger{passengers.length > 1 ? "s" : ""} ·{" "}
              <span className="font-semibold text-navy-900">
                INR {totalAmount.toLocaleString("en-IN")}
              </span>{" "}
              total
            </p>
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? "Saving…" : "Continue to payment"}
            </Button>
          </div>
        </form>
      </Container>
    </div>
  );
}

export default function PassengerDetailsPage() {
  return (
    <PageShell>
      <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading…</div>}>
        <PassengerDetailsContent />
      </Suspense>
    </PageShell>
  );
}
