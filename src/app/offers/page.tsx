import { Tag, Copy } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { offers } from "@/lib/data/offers";

export default function OffersPage() {
  return (
    <PageShell>
      <PageHeader title="Offers" />

      <Container className="py-16">
        <SectionHeading
          eyebrow="Limited time"
          title="Current Offers"
          description="Stack a promo code at checkout to save on your next booking."
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {offers.map((offer) => (
            <div key={offer.id} className="brand-card flex flex-col gap-3 p-6">
              <div className="flex items-center justify-between">
                <Badge tone="amber">{offer.discount}</Badge>
                <Tag className="text-sky-500" size={20} />
              </div>
              <h3 className="text-lg font-bold text-navy-900">{offer.title}</h3>
              <p className="text-sm text-slate-600">{offer.description}</p>
              <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="text-xs text-slate-500">Valid till {offer.validTill}</span>
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-navy-900">
                  {offer.code} <Copy size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </PageShell>
  );
}
