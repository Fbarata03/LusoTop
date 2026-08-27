"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Clock, Download, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlagIcon } from "@/components/ui/flag-icon";
import { OperatorLogo } from "@/components/ui/operator-logo";
import { useAuth } from "@/lib/auth-context";
import { ApiError, downloadReceipt, fetchMyOrders } from "@/lib/api";
import type { OrderSummary } from "@/lib/types";

export default function MinhasRecargasPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/entrar");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetchMyOrders()
      .then(setOrders)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Não foi possível carregar as recargas.")
      );
  }, [user]);

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1 bg-lusotop-cream px-4 py-16 dark:bg-lusotop-navy">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-heading text-3xl font-semibold text-foreground">
            Minhas recargas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Histórico de todas as tuas recargas.
          </p>

          <div className="mt-8 space-y-3">
            {(authLoading || (!orders && !error)) && (
              <div className="flex justify-center py-12">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            )}

            {error && (
              <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {error}
              </p>
            )}

            {orders?.length === 0 && (
              <p className="rounded-xl border border-border bg-background p-6 text-center text-sm text-muted-foreground">
                Ainda não fizeste nenhuma recarga.
              </p>
            )}

            {orders?.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function OrderCard({ order }: { order: OrderSummary }) {
  const delivered = order.status === "PAID" && order.deliveryStatus === "DELIVERED";
  const failed = order.status === "PAID" && order.deliveryStatus === "FAILED";
  const processing = order.status === "PAID" && order.deliveryStatus === "PENDING";
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  async function handleDownload() {
    setDownloadError(null);
    setDownloading(true);
    try {
      await downloadReceipt(order.id);
    } catch (err) {
      setDownloadError(err instanceof ApiError ? err.message : "Não foi possível descarregar.");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <FlagIcon isoCode={order.countryIso} className="h-4 w-[22px]" />
            {order.countryName}
            <span className="text-muted-foreground">·</span>
            <OperatorLogo
              name={order.operatorName}
              logoUrl={order.operatorLogoUrl}
              className="size-4 text-[10px]"
            />
            {order.operatorName}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {order.phoneNumber} ·{" "}
            {new Date(order.createdAt).toLocaleDateString("pt-PT", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <p className="shrink-0 font-heading text-lg font-semibold text-foreground">
          {order.payerAmount.toLocaleString("pt-PT", { maximumFractionDigits: 2 })}{" "}
          {order.payerCurrency}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-sm">
        {delivered && (
          <>
            <CheckCircle2 className="size-4 text-primary" />
            <span className="text-foreground">Recarga concluída</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto h-7 gap-1 text-xs"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              Comprovativo
            </Button>
          </>
        )}
        {failed && (
          <>
            <AlertTriangle className="size-4 text-destructive" />
            <span className="text-foreground">
              Problema na entrega{order.refunded ? " (reembolsado)" : ""}
            </span>
          </>
        )}
        {processing && (
          <>
            <Loader2 className="size-4 animate-spin text-primary" />
            <span className="text-foreground">A processar</span>
          </>
        )}
        {order.status !== "PAID" && (
          <>
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Pagamento pendente</span>
          </>
        )}
      </div>

      {downloadError && (
        <p className="mt-2 text-xs text-destructive">{downloadError}</p>
      )}
    </Card>
  );
}
