import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DestinationGrid } from "@/components/home/DestinationGrid";

export default function DestinationsPage() {
  return (
    <PageShell>
      <PageHeader title="Destinations" />
      <Container className="pt-16">
        <SectionHeading
          eyebrow="Explore"
          title="Where SkyRoute Flies"
          description="From quick regional hops to long-haul classics — find your next destination."
        />
      </Container>
      <DestinationGrid />
    </PageShell>
  );
}
