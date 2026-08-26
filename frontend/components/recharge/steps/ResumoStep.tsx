"use client";

import { useEffect, useState } from "react";
import { Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FlagIcon } from "@/components/ui/flag-icon";
import { ApiError, createOrder, fetchExchangeRate } from "@/lib/api";
import type { Country, Operator, Product } from "@/lib/types";
import { cn } from "@/lib/utils";

const PAYER_CURRENCIES = ["EUR", "USD", "BRL"] as const;
type PayerCurrency = (typeof PAYER_CURRENCIES)[number];

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
  const [payerCurrency, setPayerCurrency] = useState<PayerCurrency>("EUR");
  const [rate, setRate] = useState<number | null>(null);
  const [rateAvailable, setRateAvailable] = useState(true);
  const [loadingRate, setLoadingRate] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRate() {
      if (product.currency === payerCurrency) {
        setRate(1);
        setRateAvailable(true);
        return;
      }
      setLoadingRate(true);
      try {
        const result = await fetchExchangeRate(product.currency, payerCurrency);
        if (cancelled) return;
        setRateAvailable(result.available);
        setRate(result.rate);
      } catch {
        if (!cancelled) setRateAvailable(false);
      } finally {
        if (!cancelled) setLoadingRate(false);
      }
    }

    loadRate();
    return () => {
      cancelled = true;
    };
  }, [product.currency, payerCurrency]);

  async function handlePay() {
    setPayError(null);
    setPaying(true);
    try {
      const { checkoutUrl } = await createOrder({
        countryIso: country.isoCode,
        operatorId: operator.id,
        productId: product.id,
        phoneNumber,
        payerCurrency,
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
              {operator.logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={operator.logoUrl}
                  alt=""
                  className="size-4 rounded-full border border-border bg-white object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
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
              ? `${product.label} — ${product.amount.toLocaleString("pt-PT")} ${product.currency}`
              : `${product.amount.toLocaleString("pt-PT")} ${product.currency}`
          }
        />
      </dl>

      <Separator className="my-5" />

      <div className="rounded-xl border border-border bg-muted/40 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Quanto vou pagar?</p>
          <div className="flex gap-1 rounded-lg bg-muted p-0.5">
            {PAYER_CURRENCIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setPayerCurrency(c)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-medium transition-all",
                  payerCurrency === c
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2">
          {loadingRate ? (
            <p className="text-sm text-muted-foreground">A calcular…</p>
          ) : rateAvailable && rate !== null ? (
            <p className="font-heading text-2xl font-bold text-foreground">
              ≈ {(product.amount * rate).toLocaleString("pt-PT", { maximumFractionDigits: 2 })}{" "}
              <span className="text-base font-normal text-muted-foreground">{payerCurrency}</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Conversão indisponível para {product.currency} → {payerCurrency}. O valor cobrado é
              sempre em {product.currency}.
            </p>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Estimativa com taxas de câmbio atuais. O valor final é confirmado antes do pagamento.
        </p>
      </div>

      <div className="mt-4 flex gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          <strong>Pré-lançamento.</strong> O pagamento por cartão já é
          processado a sério pelo Stripe. O envio automático da recarga para
          o número ainda está a ser ligado ao fornecedor de airtime — por
          agora, o pagamento confirma o pedido, mas a entrega é o próximo
          passo desta fase.
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
        <Button onClick={handlePay} disabled={paying}>
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
