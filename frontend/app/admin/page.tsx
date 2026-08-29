"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
  TrendingUp,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { AdminShell } from "@/components/admin/AdminShell";
import { ApiError, fetchAdminDashboard } from "@/lib/api";
import type { AdminDashboard } from "@/lib/api";
import { cn } from "@/lib/utils";

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
        <div className="mt-6 space-y-6">
          {/* Dinheiro -- em destaque, primeiro */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat
              icon={Wallet}
              label="Valor total recebido"
              value={EUR(data.totalRevenueEur)}
              tone="primary"
            />
            <Stat
              icon={TrendingUp}
              label="Margem bruta (recargas entregues)"
              value={EUR(data.grossMarginEur)}
              tone="primary"
            />
            <Stat icon={Users} label="Total de clientes" value={data.totalCustomers} tone="neutral" />
          </div>

          {/* Estado das recargas */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Estado das recargas</h2>
            <div className="mt-2 grid gap-4 sm:grid-cols-3">
              <Stat
                icon={CheckCircle2}
                label="Entregues"
                value={data.deliveredOrders}
                tone="success"
              />
              <Stat
                icon={Clock}
                label="Em processamento"
                value={data.pendingDeliveryOrders}
                tone="neutral"
              />
              <Stat
                icon={AlertTriangle}
                label="Falhadas"
                value={data.failedDeliveryOrders}
                tone={data.failedDeliveryOrders > 0 ? "danger" : "neutral"}
              />
            </div>
          </div>

          {/* Pagamentos e atividade */}
          <div>
            <h2 className="text-sm font-medium text-muted-foreground">Pagamentos e atividade</h2>
            <div className="mt-2 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Stat icon={CreditCard} label="Pagamentos concluídos" value={data.paidOrders} tone="neutral" />
              <Stat
                icon={XCircle}
                label="Pagamentos falhados"
                value={data.failedPayments}
                tone={data.failedPayments > 0 ? "danger" : "neutral"}
              />
              <Stat icon={Clock} label="Transações hoje" value={data.ordersToday} tone="neutral" />
              <Stat icon={Clock} label="Transações este mês" value={data.ordersThisMonth} tone="neutral" />
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}

const TONE_STYLES = {
  primary: "border-primary/20 bg-primary/5",
  success: "border-primary/20 bg-primary/5",
  danger: "border-destructive/30 bg-destructive/5",
  neutral: "border-border bg-background",
} as const;

const ICON_TONE = {
  primary: "text-primary",
  success: "text-primary",
  danger: "text-destructive",
  neutral: "text-muted-foreground",
} as const;

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  tone: keyof typeof TONE_STYLES;
}) {
  return (
    <Card className={cn("flex items-start gap-3 p-5", TONE_STYLES[tone])}>
      <Icon className={cn("mt-0.5 size-5 shrink-0", ICON_TONE[tone])} />
      <div className="min-w-0">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 truncate font-heading text-2xl font-semibold text-foreground">{value}</p>
      </div>
    </Card>
  );
}
