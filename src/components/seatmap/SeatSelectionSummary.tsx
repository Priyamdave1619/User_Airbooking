import { Seat } from "@/types";
import { Button } from "@/components/ui/Button";
import { X } from "lucide-react";

interface SeatSelectionSummaryProps {
  seats: Seat[];
  selectedSeatIds: string[];
  requiredCount: number;
  basePriceInr: number;
  onRemove: (seatId: string) => void;
  onContinue: () => void;
}

export function SeatSelectionSummary({
  seats,
  selectedSeatIds,
  requiredCount,
  basePriceInr,
  onRemove,
  onContinue,
}: SeatSelectionSummaryProps) {
  const selectedSeats = selectedSeatIds
    .map((id) => seats.find((s) => s.id === id))
    .filter((s): s is Seat => Boolean(s));

  const seatSurcharge = selectedSeats.reduce((sum, s) => sum + s.priceInr, 0);
  const total = basePriceInr * requiredCount + seatSurcharge;

  return (
    <div className="brand-card sticky top-24 p-6">
      <h3 className="text-lg font-bold text-navy-900">Your seats</h3>
      <p className="text-sm text-slate-500">
        {selectedSeats.length} of {requiredCount} selected
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {selectedSeats.length === 0 && (
          <p className="rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
            Tap seats on the map to assign them to your passengers.
          </p>
        )}
        {selectedSeats.map((seat) => (
          <div
            key={seat.id}
            className="flex items-center justify-between rounded-xl bg-sky-50 px-3 py-2 text-sm"
          >
            <div>
              <span className="font-bold text-navy-900">{seat.label}</span>
              <span className="ml-2 text-xs capitalize text-sky-600">{seat.tier}</span>
            </div>
            <div className="flex items-center gap-2">
              {seat.priceInr > 0 && (
                <span className="text-xs text-slate-500">
                  +INR {seat.priceInr.toLocaleString("en-IN")}
                </span>
              )}
              <button
                type="button"
                onClick={() => onRemove(seat.id)}
                aria-label={`Remove seat ${seat.label}`}
                className="text-slate-400 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Fare ({requiredCount} pax)</span>
          <span>INR {(basePriceInr * requiredCount).toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Seat selection</span>
          <span>INR {seatSurcharge.toLocaleString("en-IN")}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-lg font-bold text-navy-900">
          <span>Total</span>
          <span>INR {total.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <Button
        className="mt-5 w-full"
        size="lg"
        disabled={selectedSeats.length < requiredCount}
        onClick={onContinue}
      >
        Continue to passenger details
      </Button>
    </div>
  );
}
