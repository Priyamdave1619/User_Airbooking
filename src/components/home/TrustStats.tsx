const stats = [
  { value: "250+", label: "Destinations" },
  { value: "4.2M", label: "Trips booked yearly" },
  { value: "98%", label: "On-time departures" },
  { value: "24/7", label: "Customer support" },
];

export function TrustStats() {
  return (
    <section className="bg-navy-900 py-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-display text-3xl font-bold text-amber-400 sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-slate-300">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
