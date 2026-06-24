"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageShell } from "@/components/layout/PageShell";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/context/AuthContext";
import { getAllTransactions, subscribeToDb } from "@/lib/store/db";
import { toast } from "@/components/ui/Toast";
import type { Transaction } from "@/types";
import {
  CreditCard, Search, Filter, Download, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, ArrowUpRight, Wallet, Building2, Smartphone,
} from "lucide-react";

const METHOD_ICONS: Record<string, React.ElementType> = {
  card: CreditCard,
  upi: Smartphone,
  netbanking: Building2,
  wallet: Wallet,
};

const PAGE_SIZE = 8;

function StatusBadge({ status }: { status: "success" | "failed" }) {
  return status === "success" ? (
    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
      <CheckCircle size={11} /> Success
    </span>
  ) : (
    <span className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
      <XCircle size={11} /> Failed
    </span>
  );
}

export default function PaymentHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  const loadTx = useCallback(() => {
    const all = Object.values(getAllTransactions()).filter(
      (t) => t.referenceId !== "seed"
    );
    all.sort((a, b) => b.createdAt - a.createdAt);
    setTransactions(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) { router.push("/login"); return; }
    loadTx();
    const unsub = subscribeToDb(loadTx);
    return unsub;
  }, [user, router, loadTx]);

  const filtered = transactions.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (methodFilter !== "all" && t.method !== methodFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!t.id.toLowerCase().includes(q) && !t.pnr.toLowerCase().includes(q)) return false;
    }
    if (dateFrom) {
      const from = new Date(dateFrom).setHours(0, 0, 0, 0);
      if (t.createdAt < from) return false;
    }
    if (dateTo) {
      const to = new Date(dateTo).setHours(23, 59, 59, 999);
      if (t.createdAt > to) return false;
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const totalSuccess = filtered.filter((t) => t.status === "success").reduce((s, t) => s + t.amount, 0);

  function handleExport() {
    const rows = [
      ["Transaction ID", "PNR", "Date", "Method", "Amount (INR)", "Status"],
      ...filtered.map((t) => [
        t.id,
        t.pnr,
        new Date(t.createdAt).toLocaleString("en-IN"),
        t.methodLabel,
        t.amount,
        t.status,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "skyroute_payment_history.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Payment history exported!");
  }

  if (!user) return null;

  return (
    <PageShell>
      <div className="bg-slate-50 py-10">
        <Container>
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Account</p>
              <h1 className="text-2xl font-bold text-navy-900">Payment History</h1>
              <p className="text-sm text-slate-500">View all your transaction records</p>
            </div>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download size={14} />
              Export CSV
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Total Transactions", value: filtered.length, icon: CreditCard, color: "text-sky-600 bg-sky-50" },
              { label: "Successful", value: filtered.filter(t => t.status === "success").length, icon: CheckCircle, color: "text-emerald-600 bg-emerald-50" },
              { label: "Failed", value: filtered.filter(t => t.status === "failed").length, icon: XCircle, color: "text-red-500 bg-red-50" },
              { label: "Total Spent", value: `₹${totalSuccess.toLocaleString("en-IN")}`, icon: ArrowUpRight, color: "text-amber-600 bg-amber-50" },
            ].map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="brand-card p-4">
                  <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-xl ${card.color}`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-xs text-slate-500">{card.label}</p>
                  <p className="text-xl font-bold text-navy-900">{card.value}</p>
                </div>
              );
            })}
          </div>

          {/* Filters */}
          <div className="brand-card mb-5 p-4">
            <div className="flex flex-wrap gap-3">
              <div className="relative min-w-[180px] flex-1">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search TXN ID or PNR…"
                  className="w-full rounded-xl border border-slate-200 py-2 pl-8 pr-3 text-sm focus:border-sky-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1">
                <Filter size={12} className="text-slate-400" />
                {["all", "success", "failed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s); setPage(1); }}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${statusFilter === s ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                  >
                    {s === "all" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {["all", "card", "upi", "netbanking", "wallet"].map((m) => (
                  <button
                    key={m}
                    onClick={() => { setMethodFilter(m); setPage(1); }}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${methodFilter === m ? "bg-amber-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                  >
                    {m === "all" ? "All Methods" : m === "netbanking" ? "Net Banking" : m.charAt(0).toUpperCase() + m.slice(1)}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-sky-400 focus:outline-none" />
                <span className="text-xs text-slate-400">to</span>
                <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-sky-400 focus:outline-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="grid gap-3">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : paginated.length === 0 ? (
            <div className="brand-card flex flex-col items-center gap-3 py-16 text-center">
              <CreditCard size={40} className="text-slate-300" />
              <p className="font-semibold text-slate-700">No transactions found</p>
              <p className="text-sm text-slate-400">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div className="brand-card overflow-hidden p-0">
                {/* Table header */}
                <div className="hidden grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-100 bg-slate-50 px-6 py-3 text-[10px] font-bold uppercase tracking-wide text-slate-400 sm:grid">
                  <span>Transaction ID</span>
                  <span>Booking Ref</span>
                  <span>Date & Time</span>
                  <span>Method</span>
                  <span>Amount</span>
                  <span>Status</span>
                </div>

                {paginated.map((t, idx) => {
                  const MethodIcon = METHOD_ICONS[t.method] ?? CreditCard;
                  const dateStr = new Date(t.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit", month: "short", year: "numeric",
                  });
                  const timeStr = new Date(t.createdAt).toLocaleTimeString("en-IN", {
                    hour: "2-digit", minute: "2-digit",
                  });

                  return (
                    <div
                      key={t.id}
                      className={`grid grid-cols-1 gap-2 px-6 py-4 sm:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] sm:items-center sm:gap-4 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"} border-b border-slate-100 last:border-0`}
                    >
                      <div>
                        <p className="font-mono text-xs font-semibold text-navy-900 truncate">{t.id}</p>
                      </div>
                      <div>
                        <span className="inline-block rounded-md bg-sky-50 px-2 py-0.5 font-mono text-xs font-bold text-sky-700">
                          {t.pnr}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{dateStr}</p>
                        <p className="text-[10px] text-slate-400">{timeStr}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100">
                          <MethodIcon size={13} className="text-slate-600" />
                        </div>
                        <span className="text-xs text-slate-600">{t.methodLabel}</span>
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${t.status === "success" ? "text-navy-900" : "text-slate-400"}`}>
                          ₹{t.amount.toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <StatusBadge status={t.status} />
                        <button
                          onClick={() => toast.info(`Downloading invoice for ${t.id}…`)}
                          className="text-slate-400 hover:text-sky-600 transition"
                          title="Download Invoice"
                        >
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-sky-300 disabled:opacity-40"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`h-8 w-8 rounded-lg text-xs font-semibold transition ${page === p ? "bg-sky-500 text-white" : "border border-slate-200 text-slate-600 hover:border-sky-300"}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-sky-300 disabled:opacity-40"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </Container>
      </div>
    </PageShell>
  );
}
