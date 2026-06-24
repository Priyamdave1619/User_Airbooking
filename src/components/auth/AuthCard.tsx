import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

interface AuthCardProps {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="brand-card w-full max-w-md p-8 sm:p-10">
        <Link href="/" className="mx-auto flex w-fit items-center justify-center">
          <Image
            src="/images/original-logo.png"
            alt="SkyRoute Airlines"
            width={120}
            height={90}
            className="h-20 w-auto object-contain"
          />
        </Link>
        <h1 className="mt-6 text-center text-2xl font-bold text-navy-900">{title}</h1>
        {subtitle && (
          <p className="mt-2 text-center text-sm text-slate-500">{subtitle}</p>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
