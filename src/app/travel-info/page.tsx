import { Compass, Ticket, Building2 } from "lucide-react";
import Image from "next/image";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/lib/data/testimonials";

const services = [
  {
    icon: Compass,
    title: "Travel Guide",
    description: "City guides covering visas, weather, and local transport for every route we fly.",
  },
  {
    icon: Ticket,
    title: "Ticket Booking",
    description: "Search and book fares across Economy, Business, and First in a few clicks.",
  },
  {
    icon: Building2,
    title: "Hotel Booking",
    description: "Pair your flight with a hotel through our trusted travel partners.",
  },
];

export default function TravelInfoPage() {
  return (
    <PageShell>
      <PageHeader title="Travel Info" />

      <Container className="py-16">
        <SectionHeading title="Travel Services" />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {services.map((service) => (
            <div key={service.title} className="rounded-2xl bg-white p-8 text-center shadow-sm">
              <service.icon className="mx-auto mb-4 text-sky-500" size={32} />
              <h3 className="text-lg font-bold text-navy-900">{service.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{service.description}</p>
            </div>
          ))}
        </div>
      </Container>

      <div className="bg-slate-50 py-16">
        <Container>
          <SectionHeading
            eyebrow="SkyRoute"
            title="Our team guides you through every airport"
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((person) => (
              <div key={person.id} className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
                  <Image src={person.image} alt={person.name} fill className="object-cover" />
                </div>
                <p className="mt-4 text-sm text-slate-600">&ldquo;{person.quote}&rdquo;</p>
                <h5 className="mt-3 font-bold text-navy-900">{person.name}</h5>
                <span className="text-xs text-slate-500">{person.role}</span>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </PageShell>
  );
}
