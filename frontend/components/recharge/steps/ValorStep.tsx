"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchProductsByOperator, ApiError } from "@/lib/api";
import type { Operator, Product } from "@/lib/types";

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
      <h3 className="font-heading text-xl font-semibold text-foreground">
        Quanto quer enviar?
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Valores disponíveis para {operator.name}.
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

      {products && products.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product)}
              className="rounded-xl border border-border px-4 py-3 text-center font-medium text-foreground transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm active:scale-[0.98]"
            >
              {product.amount.toLocaleString("pt-PT")} {product.currency}
            </button>
          ))}
        </div>
      )}

      {products?.length === 0 && (
        <p className="mt-4 rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
          Não há valores disponíveis para esta operadora de momento.
        </p>
      )}

      <Button variant="ghost" className="mt-6" onClick={onBack}>
        Voltar
      </Button>
    </div>
  );
}
