"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlagIcon } from "@/components/ui/flag-icon";
import { ApiError, confirmOrder } from "@/lib/api";
import type { OrderSummary } from "@/lib/types";

function SucessoContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sessionId) {
      setError("Sessão de pagamento não encontrada.");
      setLoading(false);
      return;
    }
    confirmOrder(sessionId)
      .then(setOrder)
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "Não foi possível confirmar o pagamento.")
      )
      .finally(() => setLoading(false));
  }, [sessionId]);

  return (
    <Card className="w-full max-w-md p-6 text-center">
      {loading && (
        <>
          <Loader2 className="mx-auto size-10 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">A confirmar o pagamento…</p>
        </>
      )}

      {!loading && error && (
        <>
          <XCircle className="mx-auto size-10 text-destructive" />
          <h1 className="mt-4 font-heading text-xl font-semibold text-foreground">
            Não foi possível confirmar
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </>
      )}

      {!loading && !error && order && (
        <>
          <CheckCircle2 className="mx-auto size-10 text-primary" />
          <h1 className="mt-4 font-heading text-xl font-semibold text-foreground">
            {order.status === "PAID" ? "Pagamento confirmado" : "Pagamento pendente"}
          </h1>
          <dl className="mt-5 space-y-2 text-left text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Destino</dt>
              <dd className="flex items-center gap-1.5 font-medium text-foreground">
                <FlagIcon isoCode={order.countryIso} className="h-4 w-[22px]" />
                {order.countryName}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Operadora</dt>
              <dd className="font-medium text-foreground">{order.operatorName}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Número</dt>
              <dd className="font-medium text-foreground">{order.phoneNumber}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted-foreground">Pago</dt>
              <dd className="font-medium text-foreground">
                {order.payerAmount.toLocaleString("pt-PT", { maximumFractionDigits: 2 })}{" "}
                {order.payerCurrency}
              </dd>
            </div>
          </dl>
        </>
      )}

      <Button render={<Link href="/" />} className="mt-6 w-full">
        Voltar ao início
      </Button>
    </Card>
  );
}

export default function SucessoPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-lusotop-cream px-4 py-16">
        <Suspense
          fallback={<Loader2 className="size-10 animate-spin text-primary" />}
        >
          <SucessoContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
