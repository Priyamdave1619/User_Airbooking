import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface PageHeaderProps {
  title: string;
  crumb?: string;
}

export function PageHeader({ title, crumb }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-br from-navy-900 to-navy-700 py-16 text-center text-white">
      <h1 className="text-3xl font-bold uppercase tracking-wide sm:text-4xl">{title}</h1>
      <div className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-300">
        <Link href="/" className="uppercase hover:text-white">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="uppercase">{crumb ?? title}</span>
      </div>
    </div>
  );
}
