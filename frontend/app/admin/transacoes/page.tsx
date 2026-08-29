"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2, Search } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Input } from "@/components/ui/input";
import { ApiError, fetchAdminOrders } from "@/lib/api";
import type { AdminOrder } from "@/lib/api";
import { cn } from "@/lib/utils";

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "delivered", label: "Entregues" },
  { key: "pending", label: "A processar" },
  { key: "failed", label: "Falhadas" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function AdminTransacoesPage() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");

  useEffect(() => {
    fetchAdminOrders()
      .then(setOrders)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Não foi possível carregar."));
  }, []);

  const filtered = useMemo(() => {
    if (!orders) return [];
    const q = search.trim().toLowerCase();
    return orders.filter((order) => {
      if (filter === "delivered" && order.deliveryStatus !== "DELIVERED") return false;
      if (filter === "pending" && !(order.status === "PAID" && order.deliveryStatus === "PENDING")) return false;
      if (filter === "failed" && order.deliveryStatus !== "FAILED") return false;
      if (!q) return true;
      return (
        order.customerName?.toLowerCase().includes(q) ||
        order.customerEmail?.toLowerCase().includes(q) ||
        order.phoneNumber.toLowerCase().includes(q) ||
        order.countryName.toLowerCase().includes(q) ||
        order.operatorName.toLowerCase().includes(q)
      );
    });
  }, [orders, search, filter]);

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Transações</h1>
        {orders && (
          <p className="text-sm text-muted-foreground">
            {filtered.length} de {orders.length}
          </p>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!orders && !error && (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      )}

      {orders && (
        <>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar por nome, email, número, país…"
                className="pl-9"
              />
            </div>
            <div className="flex gap-1.5 rounded-xl bg-muted p-1">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all",
                    filter === f.key
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Telemóvel: cartões */}
          <div className="mt-4 space-y-3 lg:hidden">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
            {filtered.length === 0 && (
              <p className="rounded-xl border border-border bg-background p-6 text-center text-sm text-muted-foreground">
                Nenhuma transação encontrada.
              </p>
            )}
          </div>

          {/* Ecrã largo: tabela */}
          <div className="mt-4 hidden overflow-x-auto rounded-xl border border-border bg-background lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="p-3 font-medium">Cliente</th>
                  <th className="p-3 font-medium">País / Operadora</th>
                  <th className="p-3 font-medium">Número</th>
                  <th className="p-3 font-medium">Valor</th>
                  <th className="p-3 font-medium">Pagamento</th>
                  <th className="p-3 font-medium">Entrega</th>
                  <th className="p-3 font-medium">Data</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-border align-top last:border-0">
                    <td className="p-3">
                      {order.customerName ? (
                        <>
                          <p className="font-medium text-foreground">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Sem conta</span>
                      )}
                    </td>
                    <td className="p-3 text-foreground">
                      {order.countryName} · {order.operatorName}
                    </td>
                    <td className="p-3 text-foreground">{order.phoneNumber}</td>
                    <td className="p-3 text-foreground">
                      {order.payerAmount.toLocaleString("pt-PT", { maximumFractionDigits: 2 })}{" "}
                      {order.payerCurrency}
                    </td>
                    <td className="p-3">
                      <StatusBadge value={order.status} />
                    </td>
                    <td className="p-3">
                      <StatusBadge value={order.deliveryStatus} extra={order.refunded ? "Reembolsado" : undefined} />
                      {order.deliveryError && (
                        <p className="mt-1 flex items-start gap-1 text-xs text-destructive">
                          <AlertTriangle className="mt-0.5 size-3 shrink-0" />
                          <span className="line-clamp-2">{order.deliveryError}</span>
                        </p>
                      )}
                    </td>
                    <td className="p-3 whitespace-nowrap text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("pt-PT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-muted-foreground">
                      Nenhuma transação encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}

function OrderCard({ order }: { order: AdminOrder }) {
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {order.customerName ? (
            <>
              <p className="truncate font-medium text-foreground">{order.customerName}</p>
              <p className="truncate text-xs text-muted-foreground">{order.customerEmail}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Sem conta</p>
          )}
        </div>
        <p className="shrink-0 font-heading text-base font-semibold text-foreground">
          {order.payerAmount.toLocaleString("pt-PT", { maximumFractionDigits: 2 })} {order.payerCurrency}
        </p>
      </div>

      <p className="mt-2 text-sm text-foreground">
        {order.countryName} · {order.operatorName} · {order.phoneNumber}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <StatusBadge value={order.status} />
        <StatusBadge value={order.deliveryStatus} extra={order.refunded ? "Reembolsado" : undefined} />
        <span className="ml-auto text-xs text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString("pt-PT", { day: "2-digit", month: "short" })}
        </span>
      </div>

      {order.deliveryError && (
        <p className="mt-2 flex items-start gap-1 rounded-lg bg-destructive/5 p-2 text-xs text-destructive">
          <AlertTriangle className="mt-0.5 size-3 shrink-0" />
          {order.deliveryError}
        </p>
      )}
    </div>
  );
}

const STATUS_TONE: Record<string, string> = {
  DELIVERED: "bg-primary/10 text-primary",
  PAID: "bg-primary/10 text-primary",
  PENDING: "bg-muted text-muted-foreground",
  FAILED: "bg-destructive/10 text-destructive",
  CANCELLED: "bg-muted text-muted-foreground",
};

const STATUS_LABEL: Record<string, string> = {
  DELIVERED: "Entregue",
  PAID: "Pago",
  PENDING: "Pendente",
  FAILED: "Falhado",
  CANCELLED: "Cancelado",
};

function StatusBadge({ value, extra }: { value: string; extra?: string }) {
  return (
    <span className="inline-flex flex-col gap-0.5">
      <span
        className={cn(
          "inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium",
          STATUS_TONE[value] ?? "bg-muted text-muted-foreground"
        )}
      >
        {STATUS_LABEL[value] ?? value}
      </span>
      {extra && <span className="text-[10px] text-muted-foreground">{extra}</span>}
    </span>
  );
}
