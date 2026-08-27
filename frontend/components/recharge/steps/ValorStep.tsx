"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProductsByOperator, ApiError } from "@/lib/api";
import type { Operator, Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { OperatorLogo } from "@/components/ui/operator-logo";

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

  return (
    <div>
      <h3 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
        <span className="h-6 w-1.5 rounded-full bg-primary" />
        Escolha o valor
      </h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <OperatorLogo name={operator.name} logoUrl={operator.logoUrl} className="size-4 text-[10px]" />
        Valor do saldo a enviar para {operator.name}.
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
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {products.map((product) => (
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

          {products.length === 0 && (
            <p className="col-span-full rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
              Não há valores disponíveis para esta operadora.
            </p>
          )}
        </div>
      )}

      <Button variant="ghost" className="mt-6" onClick={onBack}>
        Voltar
      </Button>
    </div>
  );
}
