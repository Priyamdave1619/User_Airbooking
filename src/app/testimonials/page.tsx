import Image from "next/image";
import { Quote } from "lucide-react";
import { PageShell } from "@/components/layout/PageShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/lib/data/testimonials";

export default function TestimonialsPage() {
  return (
    <PageShell>
      <PageHeader title="Testimonials" />

      <Container className="py-16">
        <SectionHeading
          eyebrow="Trusted by travelers"
          title="What our passengers say"
        />

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {testimonials.map((person) => (
            <div key={person.id} className="brand-card flex gap-5 p-6">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full">
                <Image src={person.image} alt={person.name} fill className="object-cover" />
              </div>
              <div>
                <Quote className="mb-2 text-sky-300" size={20} />
                <p className="text-sm text-slate-600">{person.quote}</p>
                <h5 className="mt-3 font-bold text-navy-900">{person.name}</h5>
                <span className="text-xs text-slate-500">{person.role}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </PageShell>
  );
}
