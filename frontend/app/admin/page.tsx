"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AdminShell } from "@/components/admin/AdminShell";
import { ApiError, fetchAdminDashboard } from "@/lib/api";
import type { AdminDashboard } from "@/lib/api";

const EUR = (value: number) =>
  value.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });

export default function AdminDashboardPage() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminDashboard()
      .then(setData)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Não foi possível carregar."));
  }, []);

  return (
    <AdminShell>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Dashboard</h1>

      {error && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!data && !error && (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      )}

      {data && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Stat label="Total de clientes" value={data.totalCustomers} />
          <Stat label="Total de recargas" value={data.totalOrders} />
          <Stat label="Recargas concluídas" value={data.deliveredOrders} />
          <Stat label="Recargas em processamento" value={data.pendingDeliveryOrders} />
          <Stat label="Recargas falhadas" value={data.failedDeliveryOrders} />
          <Stat label="Pagamentos concluídos" value={data.paidOrders} />
          <Stat label="Pagamentos falhados" value={data.failedPayments} />
          <Stat label="Valor total recebido" value={EUR(data.totalRevenueEur)} />
          <Stat label="Transações hoje" value={data.ordersToday} />
          <Stat label="Transações este mês" value={data.ordersThisMonth} />
        </div>
      )}
    </AdminShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-heading text-2xl font-semibold text-foreground">{value}</p>
    </Card>
  );
}
