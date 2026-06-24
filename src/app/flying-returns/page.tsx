"use client";

import { FormEvent, useState } from "react";
import { Award, Sparkles, Plane } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cities } from "@/lib/data/cities";

const tiers = [
  {
    name: "Blue",
    miles: "0 – 24,999 miles",
    perk: "Priority check-in window and standard mile earning rate.",
  },
  {
    name: "Silver",
    miles: "25,000 – 74,999 miles",
    perk: "Free seat selection and a 25% mile-earning bonus.",
  },
  {
    name: "Gold",
    miles: "75,000+ miles",
    perk: "Lounge access, priority boarding, and a 50% mile-earning bonus.",
  },
];

export default function FlyingReturnsPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <PageShell>
      <PageHeader title="Flying Returns" />

      <Container className="py-16">
        <SectionHeading
          eyebrow="Loyalty program"
          title="Earn miles on every trip"
          description="Flying Returns members earn miles toward free flights, seat upgrades, and lounge access."
        />

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 sm:grid-cols-3">
          {tiers.map((tier) => (
            <div key={tier.name} className="brand-card p-6 text-center">
              <Award className="mx-auto text-amber-500" size={28} />
              <h3 className="mt-3 text-lg font-bold text-navy-900">{tier.name}</h3>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
                {tier.miles}
              </p>
              <p className="mt-2 text-sm text-slate-600">{tier.perk}</p>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <div className="brand-card p-8">
            <div className="mb-6 flex items-center gap-3">
              <Sparkles className="text-sky-500" size={22} />
              <h3 className="text-lg font-bold text-navy-900">Check redemption miles</h3>
            </div>

            {submitted ? (
              <p className="text-sm text-slate-600">
                Redemption seats from <strong>{from}</strong> to <strong>{to}</strong> start
                around 45,000 miles in Economy and 110,000 miles in Business, depending on
                the travel date. Sign in to your Flying Returns account to confirm exact
                pricing and lock in a seat.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <Select label="Flying from" required value={from} onChange={(e) => setFrom(e.target.value)}>
                  <option value="">From</option>
                  {cities.map((city) => (
                    <option key={city.code} value={city.code}>
                      {city.name} ({city.code})
                    </option>
                  ))}
                </Select>
                <Select label="Flying to" required value={to} onChange={(e) => setTo(e.target.value)}>
                  <option value="">To</option>
                  {cities.map((city) => (
                    <option key={city.code} value={city.code}>
                      {city.name} ({city.code})
                    </option>
                  ))}
                </Select>
                <Button type="submit" size="lg" className="sm:col-span-2">
                  <Plane size={16} /> Check miles needed
                </Button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </PageShell>
  );
}
