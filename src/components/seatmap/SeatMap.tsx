"use client";

import { useMemo } from "react";
import { Seat } from "@/types";
import { SeatButton } from "@/components/seatmap/SeatButton";
import { getRowLayout } from "@/lib/store/seatMapGenerator";

interface SeatMapProps {
  seats: Seat[];
  aircraft: string;
  maxSelectable: number;
  selectedCount: number;
  onToggleSeat: (seat: Seat) => void;
}

const tierSectionLabel: Record<string, string> = {
  first: "First Class",
  business: "Business Class",
  premium: "Premium Economy",
  economy: "Economy",
};

export function SeatMap({
  seats,
  aircraft,
  maxSelectable,
  selectedCount,
  onToggleSeat,
}: SeatMapProps) {
  const rowConfigs = useMemo(() => getRowLayout(aircraft), [aircraft]);

  const seatsByRow = useMemo(() => {
    const map = new Map<number, Seat[]>();
    for (const seat of seats) {
      const list = map.get(seat.row) ?? [];
      list.push(seat);
      map.set(seat.row, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.col.localeCompare(b.col));
    }
    return map;
  }, [seats]);

  const sectionStarts = useMemo(() => {
    const starts = new Set<number>();
    let prevTier: string | null = null;
    for (const rowConfig of rowConfigs) {
      if (rowConfig.tier !== prevTier) {
        starts.add(rowConfig.row);
        prevTier = rowConfig.tier;
      }
    }
    return starts;
  }, [rowConfigs]);

  function handleSelect(seat: Seat) {
    if (seat.status === "occupied" || seat.status === "locked") return;
    if (seat.status === "available" && selectedCount >= maxSelectable) return;
    onToggleSeat(seat);
  }

  return (
    <div className="overflow-x-auto rounded-3xl bg-gradient-to-b from-slate-100 to-white p-4 sm:p-8">
      <div className="mx-auto w-fit min-w-full sm:min-w-0">
        {/* Nose of the aircraft */}
        <div className="mx-auto mb-4 h-8 w-32 rounded-t-full border-2 border-b-0 border-slate-300 bg-white sm:w-40" />

        <div className="flex flex-col gap-1.5">
          {rowConfigs.map((rowConfig) => {
            const rowSeats = seatsByRow.get(rowConfig.row) ?? [];
            const showSectionLabel = sectionStarts.has(rowConfig.row);

            return (
              <div key={rowConfig.row}>
                {showSectionLabel && (
                  <div className="mb-2 mt-4 flex items-center gap-2 first:mt-0">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      {tierSectionLabel[rowConfig.tier]}
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                )}
                {rowConfig.isExitRow && (
                  <div className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-red-500">
                    Exit Row
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="w-6 shrink-0 text-right text-[10px] font-semibold text-slate-400">
                    {rowConfig.row}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {rowConfig.cols.map((col) => {
                      const seat = rowSeats.find((s) => s.col === col);
                      const showAisleGap = rowConfig.aisleAfter.includes(col);
                      return (
                        <span key={col} className="flex items-center gap-1.5">
                          {seat && (
                            <SeatButton seat={seat} onSelect={handleSelect} />
                          )}
                          {showAisleGap && <span className="w-4 shrink-0 sm:w-6" />}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tail of the aircraft */}
        <div className="mx-auto mt-4 h-6 w-full max-w-md rounded-b-3xl border-2 border-t-0 border-slate-300 bg-white" />
      </div>
    </div>
  );
}
