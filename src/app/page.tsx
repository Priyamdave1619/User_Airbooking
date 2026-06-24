import { PageShell } from "@/components/layout/PageShell";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { BookingSearchCard } from "@/components/booking/BookingSearchCard";
import { FeatureGrid } from "@/components/home/FeatureGrid";
import { TrustStats } from "@/components/home/TrustStats";
import { AboutSection } from "@/components/home/AboutSection";
import { DestinationGrid } from "@/components/home/DestinationGrid";
import { ScrollReveal } from "@/components/layout/ScrollReveal";

export default function HomePage() {
  return (
    <PageShell>
      <HeroCarousel />
      {/* Search card overlaps hero — rendered outside ScrollReveal so it animates immediately */}
      <div className="relative z-10 px-4">
        <BookingSearchCard />
      </div>
      <ScrollReveal className="mt-10">
        <FeatureGrid />
      </ScrollReveal>
      <ScrollReveal delay={80}>
        <TrustStats />
      </ScrollReveal>
      <ScrollReveal delay={80}>
        <AboutSection />
      </ScrollReveal>
      <ScrollReveal delay={80}>
        <DestinationGrid />
      </ScrollReveal>
    </PageShell>
  );
}
