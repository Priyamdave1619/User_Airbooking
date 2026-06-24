import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-sky-500 text-white hover:bg-sky-600 focus-visible:outline-sky-600 shadow-sm shadow-sky-500/30",
  secondary:
    "bg-amber-500 text-navy-900 hover:bg-amber-600 focus-visible:outline-amber-600",
  outline:
    "border-2 border-sky-500 text-sky-600 hover:bg-sky-50 focus-visible:outline-sky-600",
  ghost: "text-navy-900 hover:bg-slate-100 focus-visible:outline-slate-400",
  dark: "bg-navy-900 text-white hover:bg-navy-800 focus-visible:outline-navy-700",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-150",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
