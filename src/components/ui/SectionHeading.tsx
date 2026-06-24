import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left"
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mb-2 text-xs font-bold uppercase tracking-[0.3em]",
            light ? "text-sky-300" : "text-sky-600"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-3xl font-bold sm:text-4xl",
          light ? "text-white" : "text-navy-900"
        )}
      >
        {title}
      </h2>
      {description && (
        <p className={cn("mt-3 text-base", light ? "text-slate-300" : "text-slate-600")}>
          {description}
        </p>
      )}
    </div>
  );
}
