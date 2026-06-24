"use client";

import { FormEvent, useState } from "react";
import { Route, Ticket, Building2, Search } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";

const services = [
  {
    icon: Route,
    title: "Travel Guide",
    description: "Step-by-step guidance for visas, layovers, and connections on your itinerary.",
  },
  {
    icon: Ticket,
    title: "Ticket Booking",
    description: "Change your flight date, upgrade cabin, or add a passenger to an existing PNR.",
  },
  {
    icon: Building2,
    title: "Hotel Booking",
    description: "Add a hotel stay to your trip through our travel partners at member rates.",
  },
];

export default function ManagePage() {
  const [pnr, setPnr] = useState("");
  const [lastName, setLastName] = useState("");
  const [result, setResult] = useState<"idle" | "found" | "not-found">("idle");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (pnr.trim().length >= 6 && lastName.trim()) {
      setResult("found");
    } else {
      setResult("not-found");
    }
  }

  return (
    <PageShell>
      <PageHeader title="Manage Booking" crumb="Manage" />

      <Container className="py-16">
        <div className="mx-auto max-w-3xl">
          <div className="brand-card p-8">
            <h2 className="text-xl font-bold text-navy-900">Find your booking</h2>
            <p className="mt-1 text-sm text-slate-500">
              Enter your 6-character booking reference and the lead passenger&apos;s surname.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
              <input
                required
                placeholder="Booking reference (e.g. SR4F2A)"
                value={pnr}
                onChange={(e) => setPnr(e.target.value.toUpperCase())}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm uppercase focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
              <input
                required
                placeholder="Surname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
              />
              <Button type="submit">
                <Search size={16} /> Find
              </Button>
            </form>

            {result === "found" && (
              <div className="mt-5 rounded-xl bg-sky-50 p-4 text-sm text-sky-800">
                Booking <strong>{pnr}</strong> located for passenger <strong>{lastName}</strong>.
                You can now change seats, add baggage, or update contact details (demo flow).
              </div>
            )}
            {result === "not-found" && (
              <div className="mt-5 rounded-xl bg-amber-100 p-4 text-sm text-amber-800">
                We couldn&apos;t verify that reference. Double check the booking code and surname,
                or contact support if the issue continues.
              </div>
            )}
          </div>
        </div>
      </Container>

      <div className="bg-slate-50/60 border-t border-slate-100 py-16">
        <Container>
          <SectionHeading title="Tours & Travel Services" />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="rounded-2xl bg-white p-8 text-center shadow-sm">
                <service.icon className="mx-auto mb-4 text-sky-500" size={30} />
                <h3 className="text-lg font-bold text-navy-900">{service.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{service.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </PageShell>
  );
}
