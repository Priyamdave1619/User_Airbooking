"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { PaymentMethodTabs } from "@/components/payment/PaymentMethodTabs";
import { CardForm, CardFormValue } from "@/components/payment/CardForm";
import { UpiForm } from "@/components/payment/UpiForm";
import { NetBankingForm } from "@/components/payment/NetBankingForm";
import { WalletForm } from "@/components/payment/WalletForm";
import { PaymentSummary } from "@/components/payment/PaymentSummary";
import { ProcessingOverlay } from "@/components/payment/ProcessingOverlay";
import { PaymentSuccess } from "@/components/payment/PaymentSuccess";
import { PaymentFailure } from "@/components/payment/PaymentFailure";
import { flightOffers } from "@/lib/data/flights";
import { getBooking, saveTransaction, updateBookingStatus } from "@/lib/store/db";
import { generateReceiptPdf } from "@/lib/pdf/generateReceipt";
import { PaymentMethod, PaymentStatus, Transaction } from "@/types";

const methodLabels: Record<PaymentMethod, string> = {
  card: "Credit / Debit Card",
  upi: "UPI",
  netbanking: "Net Banking",
  wallet: "Wallet",
};

function generateReference() {
  return `TXN${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 900 + 100)}`;
}

function PaymentContent() {
  const router = useRouter();
  const params = useSearchParams();
  const pnr = params.get("booking") ?? "";

  const booking = getBooking(pnr);
  const flight = booking ? flightOffers.find((f) => f.id === booking.flightId) : null;

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [card, setCard] = useState<CardFormValue>({ number: "", name: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");
  const [wallet, setWallet] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [failureReason, setFailureReason] = useState("");

  if (!booking || !flight) {
    return (
      <Container className="py-20 text-center">
        <h1 className="text-xl font-bold text-navy-900">Booking not found</h1>
        <p className="mt-2 text-slate-500">
          We couldn&apos;t find a pending booking for that reference. Please start a new
          search.
        </p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          Back to home
        </Button>
      </Container>
    );
  }

  const activeBooking = booking;
  const activeFlight = flight;

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (method === "card") {
      const digits = card.number.replace(/\s/g, "");
      if (digits.length < 16) nextErrors.number = "Enter a valid 16-digit card number";
      if (!card.name) nextErrors.name = "Enter the name on the card";
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) nextErrors.expiry = "Use MM/YY format";
      if (card.cvv.length < 3) nextErrors.cvv = "Enter a valid CVV";
    } else if (method === "upi") {
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) nextErrors.upi = "Enter a valid UPI ID (e.g. name@bank)";
    } else if (method === "netbanking") {
      if (!bank) nextErrors.bank = "Select your bank";
    } else if (method === "wallet") {
      if (!wallet) nextErrors.wallet = "Select a wallet";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handlePay() {
    if (!validate()) return;
    setStatus("processing");

    // Simulate a real-time payment gateway round trip.
    setTimeout(() => {
      const referenceId = generateReference();
      // Demo heuristic: a card number ending in "0000" simulates a decline,
      // so the failure flow is reachable without random flakiness.
      const isCardDecline = method === "card" && card.number.replace(/\s/g, "").endsWith("0000");
      const success = !isCardDecline;

      const txn: Transaction = {
        id: referenceId,
        pnr: activeBooking.pnr,
        method,
        amount: activeBooking.totalAmount,
        status: success ? "success" : "failed",
        createdAt: Date.now(),
        methodLabel: methodLabels[method],
        referenceId,
      };
      saveTransaction(txn);
      setTransaction(txn);

      if (success) {
        updateBookingStatus(activeBooking.pnr, "confirmed");
        setStatus("success");
      } else {
        setFailureReason(
          "Your card was declined by the issuing bank. This often happens with insufficient funds or incorrect details."
        );
        setStatus("failed");
      }
    }, 2200);
  }

  if (status === "success" && transaction) {
    return (
      <PaymentSuccess
        booking={{ ...activeBooking, status: "confirmed" }}
        flight={activeFlight}
        transaction={transaction}
        onDownloadReceipt={() => generateReceiptPdf(booking, flight, transaction)}
      />
    );
  }

  if (status === "failed" && transaction) {
    return (
      <PaymentFailure
        reason={failureReason}
        referenceId={transaction.referenceId}
        onRetry={() => setStatus("idle")}
      />
    );
  }

  return (
    <>
      {status === "processing" && (
        <ProcessingOverlay label={`Processing your ${methodLabels[method]} payment…`} />
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="brand-card p-6 sm:p-8">
          <h1 className="text-xl font-bold text-navy-900">Choose a payment method</h1>
          <p className="mt-1 text-sm text-slate-500">
            All transactions are encrypted end-to-end.
          </p>

          <div className="mt-6">
            <PaymentMethodTabs value={method} onChange={setMethod} />
          </div>

          <div className="mt-8">
            {method === "card" && <CardForm value={card} onChange={setCard} errors={errors} />}
            {method === "upi" && (
              <UpiForm value={upiId} onChange={setUpiId} error={errors.upi} />
            )}
            {method === "netbanking" && (
              <NetBankingForm value={bank} onChange={setBank} error={errors.bank} />
            )}
            {method === "wallet" && (
              <WalletForm value={wallet} onChange={setWallet} error={errors.wallet} />
            )}
          </div>

          <Button size="lg" className="mt-8 w-full" onClick={handlePay}>
            Pay INR {activeBooking.totalAmount.toLocaleString("en-IN")}
          </Button>
          <p className="mt-3 text-center text-xs text-slate-400">
            Demo tip: a card number ending in 0000 simulates a declined payment.
          </p>
        </div>

        <PaymentSummary booking={activeBooking} flight={activeFlight} />
      </div>
    </>
  );
}

export default function PaymentPage() {
  return (
    <PageShell>
      <div className="bg-slate-50 py-10">
        <Container className="max-w-5xl">
          <Suspense fallback={<div className="py-20 text-center text-slate-500">Loading payment details…</div>}>
            <PaymentContent />
          </Suspense>
        </Container>
      </div>
    </PageShell>
  );
}
