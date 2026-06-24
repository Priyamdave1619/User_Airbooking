"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const colors = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  info: "bg-sky-50 border-sky-200 text-sky-800",
};

const iconColors = {
  success: "text-emerald-500",
  error: "text-red-500",
  warning: "text-amber-500",
  info: "text-sky-500",
};

function Toast({ toast, onDismiss }: { toast: ToastData; onDismiss: () => void }) {
  const [visible, setVisible] = useState(false);
  const Icon = icons[toast.type];

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, toast.duration ?? 4000);
    return () => clearTimeout(t);
  }, [toast.duration, onDismiss]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg transition-all duration-300",
        colors[toast.type],
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}
    >
      <Icon size={18} className={cn("mt-0.5 shrink-0", iconColors[toast.type])} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}>
        <X size={14} className="opacity-60 hover:opacity-100" />
      </button>
    </div>
  );
}

// Simple global toast store
type Listener = (toasts: ToastData[]) => void;
let toasts: ToastData[] = [];
const listeners: Set<Listener> = new Set();

function notify() {
  listeners.forEach((l) => l([...toasts]));
}

export const toast = {
  show(message: string, type: ToastType = "info", duration?: number) {
    const id = Math.random().toString(36).slice(2);
    toasts = [...toasts, { id, message, type, duration }];
    notify();
  },
  success(message: string) { this.show(message, "success"); },
  error(message: string) { this.show(message, "error"); },
  warning(message: string) { this.show(message, "warning"); },
  info(message: string) { this.show(message, "info"); },
  dismiss(id: string) {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  },
};

export function ToastContainer() {
  const [items, setItems] = useState<ToastData[]>([]);

  useEffect(() => {
    const listener: Listener = (t) => setItems(t);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-80">
      {items.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={() => toast.dismiss(t.id)} />
      ))}
    </div>
  );
}
