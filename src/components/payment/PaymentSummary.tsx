import { ShieldCheck } from "lucide-react";
import { Booking, FlightOffer } from "@/types";
import { findCity } from "@/lib/data/cities";

interface PaymentSummaryProps {
  booking: Booking;
  flight: FlightOffer;
}

export function PaymentSummary({ booking, flight }: PaymentSummaryProps) {
  const fromCity = findCity(flight.fromCode);
  const toCity = findCity(flight.toCode);
  const baseFare = flight.priceInr * booking.passengers.length;
  const seatFees = booking.totalAmount - baseFare;

  return (
    <div className="brand-card sticky top-24 p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
        Booking summary
      </p>
      <h3 className="mt-1 text-lg font-bold text-navy-900">
        {fromCity?.name ?? flight.fromCode} &rarr; {toCity?.name ?? flight.toCode}
      </h3>
      <p className="text-sm text-slate-500">
        PNR <span className="font-mono font-bold text-navy-900">{booking.pnr}</span>
      </p>

      <div className="mt-5 flex flex-col gap-2 border-t border-slate-100 pt-4 text-sm">
        <div className="flex items-center justify-between text-slate-500">
          <span>Base fare × {booking.passengers.length}</span>
          <span>INR {baseFare.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex items-center justify-between text-slate-500">
          <span>Seat selection</span>
          <span>INR {Math.max(seatFees, 0).toLocaleString("en-IN")}</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-xl font-bold text-navy-900">
          <span>Total</span>
          <span>INR {booking.totalAmount.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
        <ShieldCheck className="text-sky-500" size={18} />
        Payments are encrypted and processed securely. Card details are never stored.
      </div>
    </div>
  );
}
