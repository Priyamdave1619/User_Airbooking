import Image from "next/image";
import Link from "next/link";
import { destinations } from "@/lib/data/destinations";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function DestinationGrid() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Destination" title="Top Destinations" />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <Link
              key={destination.id}
              href="/destinations"
              className="group relative block h-64 overflow-hidden rounded-2xl"
            >
              <Image
                src={destination.image}
                alt={destination.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 text-white">
                <h3 className="text-lg font-bold">{destination.name}</h3>
                <p className="text-sm text-slate-200">{destination.cityCount} Cities</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
