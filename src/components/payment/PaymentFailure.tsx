import { XCircle, RotateCcw, LifeBuoy } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PaymentFailureProps {
  reason: string;
  referenceId: string;
  onRetry: () => void;
}

export function PaymentFailure({ reason, referenceId, onRetry }: PaymentFailureProps) {
  return (
    <div className="mx-auto max-w-lg">
      <div className="brand-card p-8 text-center sm:p-10">
        <XCircle className="mx-auto text-red-500" size={64} strokeWidth={1.5} />
        <h1 className="mt-4 text-2xl font-bold text-navy-900">Payment failed</h1>
        <p className="mt-2 text-slate-600">{reason}</p>
        <p className="mt-1 text-xs text-slate-400">Reference: {referenceId}</p>

        <div className="mt-6 rounded-xl bg-amber-50 p-4 text-left text-sm text-amber-800">
          No amount has been deducted. If money was debited from your account, it will be
          automatically refunded within 5–7 business days.
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={onRetry}>
            <RotateCcw size={16} /> Try again
          </Button>
          <Button variant="outline">
            <LifeBuoy size={16} /> Contact support
          </Button>
        </div>
      </div>
    </div>
  );
}
