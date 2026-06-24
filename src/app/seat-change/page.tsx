"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SeatMap } from "@/components/seatmap/SeatMap";
import { SeatLegend } from "@/components/seatmap/SeatLegend";
import { useSeatMap } from "@/hooks/useSeatMap";
import { useSessionId } from "@/hooks/useSessionId";
import {
  getBooking, saveBooking, releaseAllSeatsFor, getAllTransactions
} from "@/lib/store/db";
import { flightOffers } from "@/lib/data/flights";
import { findCity } from "@/lib/data/cities";
import { toast } from "@/components/ui/Toast";
import type { Seat, Booking } from "@/types";
import {
  Plane, ArrowRight, AlertCircle, CheckCircle,
  RefreshCw, Armchair, Info,
} from "lucide-react";

function SeatChangeContent() {
  const router = useRouter();
  const params = useSearchParams();
  const pnr = params.get("pnr") ?? "";
  const sessionId = useSessionId();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [selectedNew, setSelectedNew] = useState<Seat | null>(null);
  const [passengerIdx, setPassengerIdx] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [done, setDone] = useState(false);
  const continuingRef = useRef(false);

  useEffect(() => {
    if (!pnr) { toast.error("No booking PNR provided."); router.push("/my-bookings"); return; }
    const b = getBooking(pnr);
    if (!b) { toast.error("Booking not found."); router.push("/my-bookings"); return; }
    if (b.status === "cancelled") { toast.error("Cannot change seats on a cancelled booking."); router.push("/my-bookings"); return; }
    setBooking(b);
  }, [pnr, router]);

  const flightId = booking?.flightId ?? "";
  const flight = flightOffers.find((f) => f.id === flightId);
  const fromCity = findCity(flight?.fromCode ?? "");
  const toCity = findCity(flight?.toCode ?? "");

  const currentPassenger = booking?.passengers[passengerIdx];
  const currentSeatId = currentPassenger?.seatId;

  // Exclude current passenger's seat from "owned" so it shows as available
  const ownedSeatIds = (booking?.passengers ?? [])
    .filter((_, i) => i !== passengerIdx)
    .map((p) => p.seatId)
    .filter(Boolean) as string[];

  const { seats, selectSeat, deselectSeat } = useSeatMap({
    flightId,
    aircraft: flight?.segments[0]?.aircraft ?? "Boeing 777",
    sessionId,
    ownedSeatIds,
  });

  useEffect(() => {
    return () => {
      if (!continuingRef.current) {
        releaseAllSeatsFor(flightId, sessionId);
      }
    };
  }, [flightId, sessionId]);

  function handleToggle(seat: Seat) {
    if (seat.status === "occupied" || seat.status === "locked") return;
    if (selectedNew?.id === seat.id) {
      deselectSeat(seat.id);
      setSelectedNew(null);
    } else {
      if (selectedNew) deselectSeat(selectedNew.id);
      selectSeat(seat.id);
      setSelectedNew(seat);
    }
  }

  const upgradeCost = selectedNew && selectedNew.priceInr > 0 ? selectedNew.priceInr : 0;

  function handleConfirm() {
    if (!booking || !currentPassenger || !selectedNew) return;
    if (selectedNew.id === currentSeatId) {
      toast.warning("You selected the same seat. Please choose a different one.");
      return;
    }
    setIsConfirming(true);
    setTimeout(() => {
      const updated: Booking = {
        ...booking,
        passengers: booking.passengers.map((p, i) =>
          i === passengerIdx ? { ...p, seatId: selectedNew.label } : p
        ),
      };
      saveBooking(updated);
      setBooking(updated);
      continuingRef.current = true;
      releaseAllSeatsFor(flightId, sessionId);
      setIsConfirming(false);
      setSelectedNew(null);
      setDone(true);
      toast.success(`Seat changed to ${selectedNew.label} successfully!`);
    }, 1200);
  }

  if (!booking || !flight) {
    return (
      <div className="bg-slate-50 py-20">
        <Container>
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <RefreshCw size={18} className="animate-spin" />
            Loading booking…
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 py-10">
      <Container>
        {/* Header */}
        <div className="brand-card mb-8 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Seat Change</p>
              <h1 className="text-2xl font-bold text-navy-900">
                {fromCity?.name ?? flight.fromCode} → {toCity?.name ?? flight.toCode}
              </h1>
              <p className="text-sm text-slate-500">
                PNR: <strong className="text-navy-900">{pnr}</strong> · {flight.travelClass} ·{" "}
                {booking.passengers.length} passenger{booking.passengers.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2">
              <Plane size={16} className="text-sky-500" />
              <span className="text-sm font-semibold text-navy-900">{flight.segments[0]?.flightNumber}</span>
            </div>
          </div>
        </div>

        {done ? (
          <div className="brand-card flex flex-col items-center gap-6 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle size={40} className="text-emerald-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-navy-900">Seat Updated!</p>
              <p className="text-sm text-slate-500">
                {currentPassenger?.fullName}&apos;s seat has been changed successfully.
              </p>
            </div>
            <div className="flex gap-3">
              {passengerIdx < booking.passengers.length - 1 ? (
                <Button
                  onClick={() => { setPassengerIdx((i) => i + 1); setDone(false); continuingRef.current = false; }}
                  variant="primary"
                >
                  Change Next Passenger&apos;s Seat
                </Button>
              ) : null}
              <Button onClick={() => router.push("/my-bookings")} variant="outline">
                Back to Bookings
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            {/* Seat map */}
            <div>
              {/* Passenger selector */}
              {booking.passengers.length > 1 && (
                <div className="mb-4 brand-card p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Changing seat for:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {booking.passengers.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={() => { setPassengerIdx(i); setSelectedNew(null); }}
                        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${passengerIdx === i
                          ? "bg-sky-500 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                      >
                        <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${passengerIdx === i ? "bg-white text-sky-500" : "bg-white text-slate-500"}`}>
                          {p.fullName[0]?.toUpperCase()}
                        </div>
                        {p.fullName}
                        <span className="opacity-70">· {p.seatId ?? "No seat"}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <SeatLegend />
              <div className="mt-4">
                <SeatMap
                  seats={seats}
                  aircraft={flight.segments[0]?.aircraft ?? "Boeing 777"}
                  maxSelectable={1}
                  selectedCount={selectedNew ? 1 : 0}
                  onToggleSeat={handleToggle}
                />
              </div>
            </div>

            {/* Change Summary */}
            <div className="flex flex-col gap-4">
              <div className="brand-card p-5">
                <p className="mb-4 text-sm font-bold text-navy-900">Seat Change Summary</p>

                {/* Passenger */}
                <div className="mb-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-600">
                    {currentPassenger?.fullName[0]?.toUpperCase() ?? "P"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-navy-900">{currentPassenger?.fullName}</p>
                    <p className="text-xs text-slate-500">{currentPassenger?.gender} · Age {currentPassenger?.age}</p>
                  </div>
                </div>

                {/* Current → New */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex-1 rounded-xl border border-slate-200 p-3 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">Current</p>
                    <div className="flex items-center justify-center gap-2">
                      <Armchair size={14} className="text-slate-400" />
                      <p className="text-lg font-bold text-slate-600">{currentSeatId ?? "None"}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-400 shrink-0" />
                  <div className={`flex-1 rounded-xl border-2 p-3 text-center transition ${selectedNew ? "border-sky-400 bg-sky-50" : "border-slate-200"}`}>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-1">New</p>
                    <div className="flex items-center justify-center gap-2">
                      <Armchair size={14} className={selectedNew ? "text-sky-500" : "text-slate-300"} />
                      <p className={`text-lg font-bold ${selectedNew ? "text-sky-600" : "text-slate-300"}`}>
                        {selectedNew?.label ?? "—"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upgrade cost */}
                {upgradeCost > 0 && (
                  <div className="mb-4 flex items-start gap-2 rounded-xl bg-amber-50 px-3 py-2.5">
                    <Info size={14} className="mt-0.5 text-amber-500 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-amber-700">Upgrade Charge</p>
                      <p className="text-xs text-amber-600">
                        This seat incurs an additional charge of{" "}
                        <strong>₹{upgradeCost.toLocaleString("en-IN")}</strong>
                      </p>
                    </div>
                  </div>
                )}

                {!selectedNew && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
                    <AlertCircle size={13} />
                    Select a seat from the map to continue.
                  </div>
                )}

                <Button
                  variant="primary"
                  className="w-full"
                  disabled={!selectedNew || isConfirming}
                  onClick={handleConfirm}
                >
                  {isConfirming ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Confirming…
                    </span>
                  ) : (
                    <>
                      <RefreshCw size={14} />
                      Confirm Seat Change
                    </>
                  )}
                </Button>

                {upgradeCost > 0 && selectedNew && (
                  <p className="mt-2 text-center text-xs text-slate-400">
                    Total upgrade charge: ₹{upgradeCost.toLocaleString("en-IN")}
                  </p>
                )}
              </div>

              {/* Real-time notice */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  <span className="font-medium text-emerald-600">Live seat availability</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  Seat availability updates in real-time. Locked seats are held by other passengers for up to 5 minutes.
                </p>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default function SeatChangePage() {
  return (
    <PageShell>
      <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading…</div>}>
        <SeatChangeContent />
      </Suspense>
    </PageShell>
  );
}
