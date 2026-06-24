import { Lock } from "lucide-react";

export function ProcessingOverlay({ label }: { label: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-navy-950/80 backdrop-blur-sm">
      <div className="relative flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 animate-spin rounded-full border-4 border-sky-400/30 border-t-sky-400" />
        <Lock className="text-white" size={26} />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold text-white">{label}</p>
        <p className="mt-1 text-sm text-slate-300">Please don&apos;t close or refresh this page</p>
      </div>
    </div>
  );
}
