"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { getAllBookings, updateBookingStatus, subscribeToDb } from "@/lib/store/db";
import { flightOffers } from "@/lib/data/flights";
import { findCity } from "@/lib/data/cities";
import { toast } from "@/components/ui/Toast";
import type { Booking } from "@/types";
import {
  Plane, Calendar, Users, Hash, TicketCheck, Download,
  X, RefreshCw, Ticket, Search, Filter, Eye,
} from "lucide-react";

const STATUS_LABELS: Record<string, { label: string; tone: "sky" | "amber" | "navy" | "slate"; color: string }> = {
  confirmed: { label: "Confirmed", tone: "sky", color: "text-sky-600 bg-sky-50" },
  pending_payment: { label: "Pending Payment", tone: "amber", color: "text-amber-700 bg-amber-50" },
  checked_in: { label: "Checked In", tone: "navy", color: "text-emerald-700 bg-emerald-50" },
  cancelled: { label: "Cancelled", tone: "slate", color: "text-red-600 bg-red-50" },
};

function BookingCard({ booking, onCancel, onViewPass }: {
  booking: Booking;
  onCancel: (pnr: string) => void;
  onViewPass: (pnr: string) => void;
}) {
  const flight = flightOffers.find((f) => f.id === booking.flightId);
  const fromCity = findCity(flight?.fromCode ?? "");
  const toCity = findCity(flight?.toCode ?? "");
  const status = STATUS_LABELS[booking.status] ?? STATUS_LABELS.confirmed;
  const seats = booking.passengers.map((p) => p.seatId).filter(Boolean);
  const createdDate = new Date(booking.createdAt).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });

  return (
    <div className="brand-card p-0 overflow-hidden">
      {/* Header strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-navy-900 to-navy-700 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <Plane size={18} className="text-white" />
          </div>
          <div>
            <p className="text-xs text-white/60">Booking ID</p>
            <p className="font-mono text-base font-bold text-white tracking-wider">{booking.pnr}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
          {status.label}
        </span>
      </div>

      <div className="p-6">
        {/* Flight route */}
        <div className="mb-5 flex items-center gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-navy-900">{flight?.fromCode ?? "—"}</p>
            <p className="text-xs text-slate-500">{fromCity?.name ?? ""}</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">{flight?.departTime ?? ""}</p>
          </div>
          <div className="flex flex-1 flex-col items-center">
            <div className="flex w-full items-center gap-2">
              <div className="h-px flex-1 bg-slate-200" />
              <Plane size={16} className="text-sky-500" />
              <div className="h-px flex-1 bg-slate-200" />
            </div>
            <p className="mt-1 text-[10px] text-slate-400">{flight?.duration ?? ""}</p>
            <p className="text-[10px] text-slate-400">{flight?.stopLabel ?? "Direct"}</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-navy-900">{flight?.toCode ?? "—"}</p>
            <p className="text-xs text-slate-500">{toCity?.name ?? ""}</p>
            <p className="text-xs font-semibold text-slate-700 mt-0.5">{flight?.arriveTime ?? ""}</p>
          </div>
        </div>

        {/* Meta grid */}
        <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-4">
          <div>
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
              <Hash size={9} /> Flight
            </p>
            <p className="text-sm font-semibold text-navy-900">
              {flight?.segments[0]?.flightNumber ?? booking.flightId}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
              <Calendar size={9} /> Booked On
            </p>
            <p className="text-sm font-semibold text-navy-900">{createdDate}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
              <Users size={9} /> Passengers
            </p>
            <p className="text-sm font-semibold text-navy-900">{booking.passengers.length}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400 mb-0.5">
              <TicketCheck size={9} /> Seats
            </p>
            <p className="text-sm font-semibold text-navy-900">
              {seats.length > 0 ? seats.join(", ") : "Not assigned"}
            </p>
          </div>
        </div>

        {/* Passengers list */}
        {booking.passengers.length > 0 && (
          <div className="mb-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Passengers</p>
            <div className="flex flex-wrap gap-2">
              {booking.passengers.map((p) => (
                <div key={p.id} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5">
                  <div className="h-5 w-5 rounded-full bg-sky-100 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-sky-600">
                      {p.fullName[0]?.toUpperCase() ?? "P"}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-slate-700">{p.fullName}</span>
                  {p.seatId && <span className="text-[10px] text-slate-400">· {p.seatId}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Amount & actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs text-slate-400">Total Paid</p>
            <p className="text-lg font-bold text-navy-900">
              ₹{booking.totalAmount.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {booking.status === "confirmed" && (
              <a href={`/check-in?pnr=${booking.pnr}`}>
                <Button size="sm" variant="primary">
                  <Eye size={13} />
                  View Boarding Pass
                </Button>
              </a>
            )}
            <Button size="sm" variant="outline" onClick={() => onViewPass(booking.pnr)}>
              <Download size={13} />
              Download Ticket
            </Button>
            {booking.status !== "cancelled" && (
              <>
                <a href={`/seat-change?pnr=${booking.pnr}`}>
                  <Button size="sm" variant="ghost">
                    <RefreshCw size={13} />
                    Change Seat
                  </Button>
                </a>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => onCancel(booking.pnr)}
                >
                  <X size={13} />
                  Cancel
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MyBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const loadBookings = useCallback(() => {
    const all = getAllBookings();
    // Show all bookings that are not demo seed bookings
    const real = Object.values(all).filter(
      (b) => !b.pnr.startsWith("DEMO") && b.contactEmail === user?.email
    );
    real.sort((a, b) => b.createdAt - a.createdAt);
    setBookings(real);
    setLoading(false);
  }, [user?.email]);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    loadBookings();
    const unsub = subscribeToDb(loadBookings);
    return unsub;
  }, [user, router, loadBookings]);

  function handleCancel(pnr: string) {
    if (!confirm("Are you sure you want to cancel this booking? This cannot be undone.")) return;
    updateBookingStatus(pnr, "cancelled");
    toast.success(`Booking ${pnr} cancelled successfully.`);
  }

  function handleDownload(pnr: string) {
    toast.info(`Preparing ticket for ${pnr}…`);
    setTimeout(() => toast.success("Ticket downloaded successfully!"), 1500);
  }

  const filtered = bookings.filter((b) => {
    if (filter !== "all" && b.status !== filter) return false;
    if (search && !b.pnr.toLowerCase().includes(search.toLowerCase()) &&
        !b.flightId.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (!user) return null;

  return (
    <PageShell>
      <div className="bg-slate-50 py-10">
        <Container>
          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Account</p>
            <h1 className="text-2xl font-bold text-navy-900">My Bookings</h1>
            <p className="text-sm text-slate-500">View and manage all your flight bookings</p>
          </div>

          {/* Filters */}
          <div className="brand-card mb-6 flex flex-wrap items-center gap-4 p-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by PNR or flight…"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-sm focus:border-sky-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={13} className="text-slate-400" />
              {["all", "confirmed", "checked_in", "pending_payment", "cancelled"].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    filter === s
                      ? "bg-sky-500 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {s === "all" ? "All" : s === "pending_payment" ? "Pending" : s === "checked_in" ? "Checked In" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Bookings */}
          {loading ? (
            <div className="grid gap-4">
              {[1, 2].map((i) => <Skeleton key={i} className="h-64 w-full" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="brand-card flex flex-col items-center gap-4 py-16 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-50">
                <Ticket size={32} className="text-sky-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-navy-900">
                  {bookings.length === 0 ? "No bookings yet" : "No bookings match your filter"}
                </p>
                <p className="text-sm text-slate-500">
                  {bookings.length === 0
                    ? "Book a flight and it will appear here."
                    : "Try adjusting your search or filter."}
                </p>
              </div>
              {bookings.length === 0 && (
                <a href="/">
                  <Button variant="primary">Search Flights</Button>
                </a>
              )}
            </div>
          ) : (
            <div className="grid gap-5">
              {filtered.map((b) => (
                <BookingCard
                  key={b.pnr}
                  booking={b}
                  onCancel={handleCancel}
                  onViewPass={handleDownload}
                />
              ))}
            </div>
          )}
        </Container>
      </div>
    </PageShell>
  );
}
