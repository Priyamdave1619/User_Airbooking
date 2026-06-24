"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
import { TextField } from "@/components/auth/TextField";
import { Button } from "@/components/ui/Button";

interface PnrLookupFormProps {
  onSubmit: (pnr: string, lastName: string) => void;
  error?: string;
  initialPnr?: string;
}

export function PnrLookupForm({ onSubmit, error, initialPnr = "" }: PnrLookupFormProps) {
  const [pnr, setPnr] = useState(initialPnr);
  const [lastName, setLastName] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(pnr.trim().toUpperCase(), lastName.trim());
  }

  return (
    <div className="brand-card mx-auto max-w-lg p-8">
      <h1 className="text-xl font-bold text-navy-900">Web Check-In</h1>
      <p className="mt-1 text-sm text-slate-500">
        Check in online from 48 hours up to 1 hour before departure.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <TextField
          id="pnr"
          label="PNR / Booking reference"
          placeholder="e.g. K3J9PQ"
          required
          value={pnr}
          onChange={(e) => setPnr(e.target.value.toUpperCase())}
        />
        <TextField
          id="lastName"
          label="Passenger's last name"
          placeholder="As on your booking"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        {error && <p className="text-sm font-medium text-red-500">{error}</p>}
        <Button type="submit" size="lg" className="w-full">
          <Search size={16} /> Find my booking
        </Button>
      </form>
    </div>
  );
}
