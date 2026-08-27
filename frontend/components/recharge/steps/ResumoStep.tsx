"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FlagIcon } from "@/components/ui/flag-icon";
import { OperatorLogo } from "@/components/ui/operator-logo";
import { ApiError, createOrder, fetchExchangeRate } from "@/lib/api";
import type { Country, Operator, Product } from "@/lib/types";

export function ResumoStep({
  country,
  operator,
  phoneNumber,
  product,
  onBack,
  onRestart,
}: {
  country: Country;
  operator: Operator;
  phoneNumber: string;
  product: Product;
  onBack: () => void;
  onRestart: () => void;
}) {
  const hasRealPrice = product.payerAmountEur !== null;
  const [rate, setRate] = useState<number | null>(null);
  const [loadingRate, setLoadingRate] = useState(!hasRealPrice);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const payerAmount = hasRealPrice
    ? product.payerAmountEur!
    : rate !== null
      ? product.amount * rate
      : null;

  useEffect(() => {
    if (hasRealPrice) return;
    let cancelled = false;

    async function loadRate() {
      if (product.currency === "EUR") {
        setRate(1);
        setLoadingRate(false);
        return;
      }
      setLoadingRate(true);
      try {
        const result = await fetchExchangeRate(product.currency, "EUR");
        if (cancelled) return;
        setRate(result.available ? result.rate : null);
      } catch {
        if (!cancelled) setRate(null);
      } finally {
        if (!cancelled) setLoadingRate(false);
      }
    }

    loadRate();
    return () => {
      cancelled = true;
    };
  }, [product.currency, hasRealPrice]);

  async function handlePay() {
    setPayError(null);
    setPaying(true);
    try {
      const { checkoutUrl } = await createOrder({
        countryIso: country.isoCode,
        operatorId: operator.id,
        productId: product.id,
        phoneNumber,
      });
      window.location.href = checkoutUrl;
    } catch (err) {
      setPayError(
        err instanceof ApiError ? err.message : "Não foi possível iniciar o pagamento."
      );
      setPaying(false);
    }
  }

  return (
    <div>
      <h3 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
        <span className="h-6 w-1.5 rounded-full bg-primary" />
        Confirme os dados da recarga
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Reveja tudo antes de avançar para o pagamento.
      </p>

      <dl className="mt-5 space-y-3 text-sm">
        <Row
          label="Destino"
          value={
            <span className="flex items-center gap-1.5">
              <FlagIcon isoCode={country.isoCode} className="h-4 w-[22px]" />
              {country.name}
            </span>
          }
        />
        <Row
          label="Operadora"
          value={
            <span className="flex items-center gap-1.5">
              <OperatorLogo
                name={operator.name}
                logoUrl={operator.logoUrl}
                className="size-4 text-[10px]"
              />
              {operator.name}
            </span>
          }
        />
        <Row label="Número" value={phoneNumber} />
        <Row label="Produto" value={PRODUCT_TYPE_LABELS[product.type] ?? "Recarga"} />
        <Row
          label="Valor"
          value={
            product.label
              ? `${product.label} · ${product.amount.toLocaleString("pt-PT")} ${product.currency}`
              : `${product.amount.toLocaleString("pt-PT")} ${product.currency}`
          }
        />
      </dl>

      <Separator className="my-5" />

      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <p className="text-sm font-medium text-foreground">Quanto vou pagar?</p>

        <div className="mt-2">
          {loadingRate ? (
            <p className="text-sm text-muted-foreground">A calcular…</p>
          ) : payerAmount !== null ? (
            <p className="font-heading text-2xl font-bold text-foreground">
              {hasRealPrice ? "" : "≈ "}
              {payerAmount.toLocaleString("pt-PT", { maximumFractionDigits: 2 })}{" "}
              <span className="text-base font-normal text-muted-foreground">EUR</span>
            </p>
          ) : (
            <p className="text-sm text-destructive">
              Conversão indisponível para {product.currency} → EUR neste momento. Tenta
              novamente daqui a pouco.
            </p>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {hasRealPrice
            ? "Valor final, sem surpresas no pagamento."
            : "Estimativa com taxas de câmbio atuais. O valor final é confirmado antes do pagamento."}
        </p>
      </div>

      {payError && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {payError}
        </p>
      )}

      <div className="mt-6 flex items-center gap-3">
        <Button variant="ghost" onClick={onBack} disabled={paying}>
          Voltar
        </Button>
        <Button onClick={handlePay} disabled={paying || loadingRate || payerAmount === null}>
          {paying ? (
            <>
              <Loader2 className="size-4 animate-spin" /> A abrir pagamento…
            </>
          ) : (
            "Pagar agora"
          )}
        </Button>
        <Button variant="ghost" onClick={onRestart} disabled={paying}>
          Recomeçar
        </Button>
      </div>
    </div>
  );
}

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  AIRTIME: "Saldo",
  DATA: "Dados móveis",
  VOICE: "Voz",
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
