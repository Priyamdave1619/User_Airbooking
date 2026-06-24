import Image from "next/image";
import { Star, MapPin, Moon } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { travelPackages } from "@/lib/data/packages";

export default function PackagesPage() {
  return (
    <PageShell>
      <PageHeader title="Travel Packages" crumb="Packages" />

      <Container className="py-16">
        <SectionHeading
          eyebrow="Bundled deals"
          title="Flight + Stay Packages"
          description="Pair your fare with hand-picked stays for a complete trip in one booking."
        />

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {travelPackages.map((pkg) => (
            <div key={pkg.id} className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
              <div className="relative h-44 w-full">
                <Image src={pkg.image} alt={pkg.title} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                  <Star size={14} fill="currentColor" /> {pkg.rating.toFixed(1)}
                </div>
                <h3 className="text-base font-bold text-navy-900">{pkg.title}</h3>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin size={14} /> {pkg.location}
                </p>
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <Moon size={14} /> {pkg.nights} nights
                </p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <p className="text-lg font-bold text-navy-900">
                    INR {pkg.priceInr.toLocaleString("en-IN")}
                  </p>
                  <Button size="sm">View</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </PageShell>
  );
}
