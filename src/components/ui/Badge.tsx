import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "sky" | "amber" | "navy" | "slate";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const toneClasses: Record<Tone, string> = {
  sky: "bg-sky-100 text-sky-700",
  amber: "bg-amber-100 text-amber-700",
  navy: "bg-navy-900 text-white",
  slate: "bg-slate-100 text-slate-700",
};

export function Badge({ className, tone = "sky", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
