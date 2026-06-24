"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Seat } from "@/types";
import { buildSeatMap } from "@/lib/store/seatMapGenerator";
import {
  ensureSeedData,
  getOccupiedSeats,
  getSeatLocks,
  lockSeat,
  releaseSeat,
  subscribeToDb,
} from "@/lib/store/db";

interface UseSeatMapOptions {
  flightId: string;
  aircraft: string;
  sessionId: string;
  /** Seats already assigned to this booking (e.g. re-entering check-in) are
   * treated as "mine" rather than occupied-by-someone-else. */
  ownedSeatIds?: string[];
}

export function useSeatMap({
  flightId,
  aircraft,
  sessionId,
  ownedSeatIds = [],
}: UseSeatMapOptions) {
  const baseSeats = useMemo(() => buildSeatMap(flightId, aircraft), [flightId, aircraft]);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    // Seed a few realistic pre-existing bookings the first time this flight
    // is ever viewed, so the seat map doesn't look artificially empty.
    const seedTargets = baseSeats
      .filter((s) => s.tier === "economy" && s.status === "available")
      .slice(0, 6)
      .map((s) => s.id);
    ensureSeedData(flightId, seedTargets);

    const unsubscribe = subscribeToDb(() => setVersion((v) => v + 1));
    return unsubscribe;
  }, [flightId, baseSeats]);

  const seats: Seat[] = useMemo(() => {
    // `version` has no direct usage below — it exists purely to force this
    // memo to recompute whenever the shared store changes (cross-tab writes,
    // other passengers locking/releasing seats, payments confirming bookings).
    void version;

    const occupied = new Set(getOccupiedSeats(flightId));
    const locks = getSeatLocks(flightId);
    const ownedSet = new Set(ownedSeatIds);

    return baseSeats.map((seat) => {
      if (ownedSet.has(seat.id)) {
        return { ...seat, status: "selected" as const };
      }
      if (occupied.has(seat.id)) {
        return { ...seat, status: "occupied" as const };
      }
      const lock = locks.find((l) => l.seatId === seat.id);
      if (lock) {
        return {
          ...seat,
          status: lock.lockedBy === sessionId ? ("selected" as const) : ("locked" as const),
          lockedBy: lock.lockedBy,
          lockedAt: lock.lockedAt,
        };
      }
      return seat.status === "occupied" ? seat : { ...seat, status: "available" as const };
    });
  }, [baseSeats, flightId, sessionId, ownedSeatIds, version]);

  const selectSeat = useCallback(
    (seatId: string) => {
      lockSeat(flightId, seatId, sessionId);
    },
    [flightId, sessionId]
  );

  const deselectSeat = useCallback(
    (seatId: string) => {
      releaseSeat(flightId, seatId);
    },
    [flightId]
  );

  return { seats, selectSeat, deselectSeat, refreshKey: version };
}
