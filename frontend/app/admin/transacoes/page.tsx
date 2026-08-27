"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ApiError, fetchAdminOrders } from "@/lib/api";
import type { AdminOrder } from "@/lib/api";
import { cn } from "@/lib/utils";

export default function AdminTransacoesPage() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminOrders()
      .then(setOrders)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Não foi possível carregar."));
  }, []);

  return (
    <AdminShell>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Transações</h1>

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
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-background">
          <table className="w-full min-w-[860px] text-left text-sm">
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
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border last:border-0">
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
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("pt-PT", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-muted-foreground">
                    Ainda não há transações.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
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
