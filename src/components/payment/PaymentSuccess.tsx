import Link from "next/link";
import { CheckCircle2, Download, ArrowRight } from "lucide-react";
import { Booking, FlightOffer, Transaction } from "@/types";
import { findCity } from "@/lib/data/cities";
import { Button } from "@/components/ui/Button";

interface PaymentSuccessProps {
  booking: Booking;
  flight: FlightOffer;
  transaction: Transaction;
  onDownloadReceipt: () => void;
}

export function PaymentSuccess({
  booking,
  flight,
  transaction,
  onDownloadReceipt,
}: PaymentSuccessProps) {
  const fromCity = findCity(flight.fromCode);
  const toCity = findCity(flight.toCode);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="brand-card overflow-hidden p-8 text-center sm:p-10">
        <CheckCircle2 className="mx-auto text-emerald-500" size={64} strokeWidth={1.5} />
        <h1 className="mt-4 text-2xl font-bold text-navy-900">Payment successful</h1>
        <p className="mt-2 text-slate-600">
          Your booking is confirmed. A receipt has been sent to{" "}
          <span className="font-semibold">{booking.contactEmail}</span>.
        </p>

        <div className="mt-8 rounded-2xl border border-dashed border-slate-200 p-6 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs text-slate-500">PNR</p>
              <p className="font-mono text-lg font-bold text-navy-900">{booking.pnr}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Amount paid</p>
              <p className="text-lg font-bold text-navy-900">
                INR {transaction.amount.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 text-sm">
            <div>
              <p className="text-xs text-slate-500">Route</p>
              <p className="font-semibold text-navy-900">
                {fromCity?.name ?? flight.fromCode} &rarr; {toCity?.name ?? flight.toCode}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Flight</p>
              <p className="font-semibold text-navy-900">{flight.id}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Passengers</p>
              <p className="font-semibold text-navy-900">{booking.passengers.length}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Payment method</p>
              <p className="font-semibold text-navy-900">{transaction.methodLabel}</p>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 text-sm">
            <p className="text-xs text-slate-500">Transaction reference</p>
            <p className="font-mono text-sm text-slate-700">{transaction.referenceId}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button variant="outline" onClick={onDownloadReceipt}>
            <Download size={16} /> Download receipt
          </Button>
          <Link href={`/check-in?pnr=${booking.pnr}`}>
            <Button>
              Proceed to web check-in <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
