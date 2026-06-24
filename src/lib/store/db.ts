"use client";

/**
 * Lightweight localStorage-backed "database" that simulates a shared backend.
 *
 * - Persists across refreshes (real localStorage, not in-memory).
 * - Syncs across tabs: writing in one tab fires a `storage` event other tabs
 *   listen for, plus a same-tab `CustomEvent` so the writing tab also updates.
 * - Seat locks have a TTL so an abandoned seat selection eventually frees up,
 *   the way a real airline reservation hold expires.
 */

import { Booking, BookingStatus, SeatLock, Transaction } from "@/types";

const KEYS = {
  bookings: "skyroute_bookings",
  seatLocks: "skyroute_seat_locks",
  transactions: "skyroute_transactions",
} as const;

export const SEAT_LOCK_TTL_MS = 5 * 60 * 1000; // 5 minutes

const DB_EVENT = "skyroute-db-change";

function isBrowser() {
  return typeof window !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  // Notify listeners in the *same* tab (the native `storage` event only
  // fires in other tabs/windows, never the one that made the change).
  window.dispatchEvent(new CustomEvent(DB_EVENT, { detail: { key } }));
}

export function subscribeToDb(callback: () => void) {
  if (!isBrowser()) return () => {};
  const handleStorage = (e: StorageEvent) => {
    if (Object.values(KEYS).includes(e.key as (typeof KEYS)[keyof typeof KEYS])) {
      callback();
    }
  };
  const handleCustom = () => callback();
  window.addEventListener("storage", handleStorage);
  window.addEventListener(DB_EVENT, handleCustom);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(DB_EVENT, handleCustom);
  };
}

/* ---------------- Bookings ---------------- */

export function getAllBookings(): Record<string, Booking> {
  return read<Record<string, Booking>>(KEYS.bookings, {});
}

export function getBooking(pnr: string): Booking | null {
  const all = getAllBookings();
  return all[pnr] ?? null;
}

export function saveBooking(booking: Booking) {
  const all = getAllBookings();
  all[booking.pnr] = booking;
  write(KEYS.bookings, all);
}

export function updateBookingStatus(pnr: string, status: BookingStatus) {
  const booking = getBooking(pnr);
  if (!booking) return;
  saveBooking({ ...booking, status });
}

export function generatePnr(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let pnr = "";
  for (let i = 0; i < 6; i++) {
    pnr += chars[Math.floor(Math.random() * chars.length)];
  }
  // Avoid astronomically unlikely but possible collision with an existing PNR
  return getBooking(pnr) ? generatePnr() : pnr;
}

/* ---------------- Seat locks (real-time hold simulation) ---------------- */

type SeatLockTable = Record<string, SeatLock>; // key: `${flightId}:${seatId}`

function lockKey(flightId: string, seatId: string) {
  return `${flightId}:${seatId}`;
}

export function getSeatLocks(flightId: string): SeatLock[] {
  const all = read<SeatLockTable>(KEYS.seatLocks, {});
  const now = Date.now();
  return Object.values(all).filter(
    (lock) => lock.flightId === flightId && now - lock.lockedAt < SEAT_LOCK_TTL_MS
  );
}

export function lockSeat(flightId: string, seatId: string, lockedBy: string) {
  const all = read<SeatLockTable>(KEYS.seatLocks, {});
  all[lockKey(flightId, seatId)] = {
    flightId,
    seatId,
    lockedBy,
    lockedAt: Date.now(),
  };
  write(KEYS.seatLocks, all);
}

export function releaseSeat(flightId: string, seatId: string) {
  const all = read<SeatLockTable>(KEYS.seatLocks, {});
  delete all[lockKey(flightId, seatId)];
  write(KEYS.seatLocks, all);
}

export function releaseAllSeatsFor(flightId: string, lockedBy: string) {
  const all = read<SeatLockTable>(KEYS.seatLocks, {});
  for (const key of Object.keys(all)) {
    if (all[key].flightId === flightId && all[key].lockedBy === lockedBy) {
      delete all[key];
    }
  }
  write(KEYS.seatLocks, all);
}

/** Permanently marks seats as occupied (post-payment) by removing the
 * temporary lock — occupancy then lives on the Booking record itself. */
export function clearLocksForSeats(flightId: string, seatIds: string[]) {
  const all = read<SeatLockTable>(KEYS.seatLocks, {});
  for (const seatId of seatIds) {
    delete all[lockKey(flightId, seatId)];
  }
  write(KEYS.seatLocks, all);
}

/* ---------------- Occupied seats derived from confirmed bookings ---------------- */

export function getOccupiedSeats(flightId: string): string[] {
  const bookings = Object.values(getAllBookings());
  const occupied: string[] = [];
  for (const booking of bookings) {
    if (booking.flightId !== flightId) continue;
    if (booking.status === "cancelled") continue;
    for (const passenger of booking.passengers) {
      if (passenger.seatId) occupied.push(passenger.seatId);
    }
  }
  return occupied;
}

/* ---------------- Transactions ---------------- */

export function getAllTransactions(): Record<string, Transaction> {
  return read<Record<string, Transaction>>(KEYS.transactions, {});
}

export function saveTransaction(transaction: Transaction) {
  const all = getAllTransactions();
  all[transaction.id] = transaction;
  write(KEYS.transactions, all);
}

export function getTransactionsForBooking(pnr: string): Transaction[] {
  return Object.values(getAllTransactions()).filter((t) => t.pnr === pnr);
}

/* ---------------- Seed demo occupancy so the seat map isn't empty ---------------- */

const SEEDED_FLAG_KEY = "skyroute_seed_done_v1";

export function ensureSeedData(flightId: string, seedSeatIds: string[]) {
  if (!isBrowser()) return;
  const flagKey = `${SEEDED_FLAG_KEY}:${flightId}`;
  if (window.localStorage.getItem(flagKey)) return;

  const all = getAllBookings();
  const pnr = `DEMO${flightId.slice(-2)}`;
  if (!all[pnr]) {
    const demoBooking: Booking = {
      pnr,
      flightId,
      passengers: seedSeatIds.map((seatId, i) => ({
        id: `seed-${i}`,
        fullName: "Other Passenger",
        phone: "",
        email: "",
        age: "",
        gender: "",
        seniorCitizen: false,
        seatId,
        checkedIn: false,
      })),
      status: "confirmed",
      contactEmail: "",
      contactPhone: "",
      createdAt: Date.now(),
      totalAmount: 0,
      transactionId: "seed",
    };
    saveBooking(demoBooking);
  }
  window.localStorage.setItem(flagKey, "1");
}

/* ---------------- OTP Store ---------------- */

import { OtpRecord, OtpPurpose } from "@/types";

const OTP_KEY = "skyroute_otps";
export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const OTP_RATE_LIMIT_MS = 60 * 1000; // 1 resend per minute
export const OTP_MAX_ATTEMPTS = 5;

function readOtps(): Record<string, OtpRecord> {
  return read<Record<string, OtpRecord>>(OTP_KEY, {});
}

function otpKey(purpose: OtpPurpose, target: string) {
  return `${purpose}:${target}`;
}

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function createOtp(purpose: OtpPurpose, target: string): OtpRecord {
  const all = readOtps();
  const key = otpKey(purpose, target);
  const record: OtpRecord = {
    code: generateOtp(),
    purpose,
    target,
    createdAt: Date.now(),
    attempts: 0,
    verified: false,
  };
  all[key] = record;
  write(OTP_KEY, all);
  return record;
}

export function verifyOtp(
  purpose: OtpPurpose,
  target: string,
  inputCode: string
): "ok" | "expired" | "invalid" | "max_attempts" {
  const all = readOtps();
  const key = otpKey(purpose, target);
  const record = all[key];
  if (!record) return "invalid";
  if (Date.now() - record.createdAt > OTP_TTL_MS) return "expired";
  if (record.attempts >= OTP_MAX_ATTEMPTS) return "max_attempts";

  record.attempts += 1;

  if (record.code !== inputCode) {
    all[key] = record;
    write(OTP_KEY, all);
    return "invalid";
  }
  record.verified = true;
  all[key] = record;
  write(OTP_KEY, all);
  return "ok";
}

export function canResendOtp(purpose: OtpPurpose, target: string): boolean {
  const all = readOtps();
  const record = all[otpKey(purpose, target)];
  if (!record) return true;
  return Date.now() - record.createdAt > OTP_RATE_LIMIT_MS;
}

export function isOtpVerified(purpose: OtpPurpose, target: string): boolean {
  const all = readOtps();
  const record = all[otpKey(purpose, target)];
  return record?.verified === true;
}
