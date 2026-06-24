import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function AboutSection() {
  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="relative h-72 overflow-hidden rounded-3xl sm:h-96">
          <Image
            src="/images/paris.jpg"
            alt="Paris skyline, one of SkyRoute's destinations"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <Badge tone="sky">About Us</Badge>
          <h2 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">
            We provide the best flight experience for your budget
          </h2>
          <p className="mt-4 text-slate-600">
            SkyRoute Airlines connects you to over 250 cities with transparent
            pricing, flexible fares, and a booking flow built around how
            people actually plan trips — not how airlines used to sell them.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="relative h-32 overflow-hidden rounded-2xl">
              <Image src="/images/about-1.jpg" alt="In-flight comfort" fill className="object-cover" />
            </div>
            <div className="relative h-32 overflow-hidden rounded-2xl">
              <Image src="/images/about-2.jpg" alt="Cabin service" fill className="object-cover" />
            </div>
          </div>
          <Link href="/search-results">
            <Button className="mt-6">Book Now</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
