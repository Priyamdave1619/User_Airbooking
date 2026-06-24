import { Banknote, Award, Globe2 } from "lucide-react";

const features = [
  {
    icon: Banknote,
    color: "bg-amber-500",
    title: "Competitive Pricing",
    description: "We work to keep every fare honest, with no surprise charges at checkout.",
  },
  {
    icon: Award,
    color: "bg-sky-500",
    title: "Best Services",
    description: "Fresh meals, comfortable seating, and cabin crew trained to anticipate your needs.",
  },
  {
    icon: Globe2,
    color: "bg-navy-800",
    title: "Worldwide Coverage",
    description: "Over 250 destinations across 6 continents, connected through one booking flow.",
  },
];

export function FeatureGrid() {
  return (
    <section className="py-16">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
        {features.map((feature) => (
          <div key={feature.title} className="flex items-start gap-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${feature.color}`}
            >
              <feature.icon className="text-white" size={26} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-900">{feature.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
