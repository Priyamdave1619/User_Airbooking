import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { FlightResultCard } from "@/components/booking/FlightResultCard";
import { flightOffers } from "@/lib/data/flights";

export default function EconomyClassPage() {
  const economyFares = flightOffers.filter((f) => f.travelClass === "Economy");
  const cheapest = economyFares.length
    ? Math.min(...economyFares.map((f) => f.priceInr))
    : null;

  return (
    <PageShell>
      <PageHeader title="Economy Class" />

      <Container className="py-16">
        <div className="brand-card mb-8 flex flex-wrap items-center justify-between gap-4 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
              Economy fares
            </p>
            <h1 className="text-2xl font-bold text-navy-900">
              Lowest price for all passengers
            </h1>
          </div>
          {cheapest !== null && (
            <p className="text-2xl font-bold text-navy-900">
              from INR {cheapest.toLocaleString("en-IN")}
            </p>
          )}
        </div>

        {economyFares.length > 0 ? (
          <div className="flex flex-col gap-4">
            {economyFares.map((offer) => (
              <FlightResultCard key={offer.id} offer={offer} />
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500">
            No Economy fares available right now — try a different route from the home page.
          </p>
        )}
      </Container>
    </PageShell>
  );
}
