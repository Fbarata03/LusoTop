"use client";

import { useEffect, useMemo, useState } from "react";
import { Wallet, Wifi, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProductsByOperator, ApiError } from "@/lib/api";
import type { Operator, Product, ProductType } from "@/lib/types";
import { cn } from "@/lib/utils";

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

  const visible = useMemo(
    () => products?.filter((p) => p.type === activeType) ?? [],
    [products, activeType]
  );

  return (
    <div>
      <h3 className="font-heading text-xl font-semibold text-foreground">
        O que quer enviar?
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
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
              return (
                <button
                  key={tab.type}
                  type="button"
                  disabled={disabled}
                  onClick={() => setActiveType(tab.type)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all",
                    disabled && "cursor-not-allowed opacity-40",
                    !disabled && activeType === tab.type
                      ? "bg-background text-foreground shadow-sm"
                      : !disabled && "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="size-4" />
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
