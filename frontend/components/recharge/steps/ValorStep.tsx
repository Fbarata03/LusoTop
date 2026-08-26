"use client";

import { useEffect, useMemo, useState } from "react";
import { Wallet, Wifi, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProductsByOperator, ApiError } from "@/lib/api";
import type { Operator, Product, ProductType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { OperatorLogo } from "@/components/ui/operator-logo";

const TYPE_TABS: { type: ProductType; label: string; icon: typeof Wallet }[] = [
  { type: "AIRTIME", label: "Saldo", icon: Wallet },
  { type: "DATA", label: "Dados", icon: Wifi },
  { type: "VOICE", label: "Voz", icon: Phone },
];

export function ValorStep({
  operator,
  onSelect,
  onBack,
}: {
  operator: Operator;
  onSelect: (product: Product) => void;
  onBack: () => void;
}) {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<ProductType>("AIRTIME");

  useEffect(() => {
    let cancelled = false;
    fetchProductsByOperator(operator.id)
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Não foi possível carregar os valores disponíveis."
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [operator.id]);

  const availableTypes = useMemo(
    () => new Set(products?.map((p) => p.type)),
    [products]
  );

  const selectedType = availableTypes.has(activeType)
    ? activeType
    : TYPE_TABS.find((tab) => availableTypes.has(tab.type))?.type;

  const visible = useMemo(
    () => products?.filter((p) => p.type === selectedType) ?? [],
    [products, selectedType]
  );

  return (
    <div>
      <h3 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
        <span className="h-6 w-1.5 rounded-full bg-primary" />
        O que quer enviar?
      </h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <OperatorLogo name={operator.name} logoUrl={operator.logoUrl} className="size-4 text-[10px]" />
        Escolha o tipo de plano e o valor para {operator.name}.
      </p>

      {error && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!products && !error && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      )}

      {products && (
        <>
          <div className="mt-4 flex gap-1.5 rounded-xl bg-muted p-1">
            {TYPE_TABS.map((tab) => {
              const disabled = !availableTypes.has(tab.type);
              const active = !disabled && selectedType === tab.type;
              return (
                <button
                  key={tab.type}
                  type="button"
                  disabled={disabled}
                  onClick={() => setActiveType(tab.type)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-all duration-300",
                    disabled && "cursor-not-allowed opacity-40",
                    active
                      ? "bg-background text-foreground shadow-sm"
                      : !disabled && "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 items-center justify-center rounded-full transition-all duration-300",
                      active ? "scale-100 bg-primary text-primary-foreground" : "scale-90 bg-transparent"
                    )}
                  >
                    <tab.icon className="size-3.5" strokeWidth={2} />
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {visible.map((product) => (
              <button
                key={product.id}
                type="button"
                onClick={() => onSelect(product)}
                className="rounded-xl border border-border px-4 py-3 text-center transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm active:scale-[0.98]"
              >
                {product.label && (
                  <span className="block font-semibold text-foreground">
                    {product.label}
                  </span>
                )}
                <span
                  className={cn(
                    "block text-foreground",
                    product.label ? "text-xs text-muted-foreground" : "font-medium"
                  )}
                >
                  {product.amount.toLocaleString("pt-PT")} {product.currency}
                </span>
              </button>
            ))}

            {visible.length === 0 && (
              <p className="col-span-full rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
                Não há planos deste tipo disponíveis para esta operadora.
              </p>
            )}
          </div>
        </>
      )}

      <Button variant="ghost" className="mt-6" onClick={onBack}>
        Voltar
      </Button>
    </div>
  );
}
