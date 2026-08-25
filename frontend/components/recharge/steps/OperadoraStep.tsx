"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchOperatorsByCountry, ApiError } from "@/lib/api";
import type { Country, Operator } from "@/lib/types";

export function OperadoraStep({
  country,
  onSelect,
  onBack,
}: {
  country: Country;
  onSelect: (operator: Operator) => void;
  onBack: () => void;
}) {
  const [operators, setOperators] = useState<Operator[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchOperatorsByCountry(country.isoCode)
      .then((data) => {
        if (!cancelled) setOperators(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Não foi possível carregar as operadoras."
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [country.isoCode]);

  return (
    <div>
      <h3 className="font-heading text-xl font-semibold text-foreground">
        Qual a operadora?
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {country.flagEmoji} Recarga para {country.name}.
      </p>

      {error && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!operators && !error && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-16 rounded-xl" />
        </div>
      )}

      {operators?.length === 0 && (
        <p className="mt-4 rounded-xl border border-border bg-muted p-4 text-sm text-muted-foreground">
          Este país estará disponível em breve.
        </p>
      )}

      {operators && operators.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {operators.map((operator) => (
            <button
              key={operator.id}
              type="button"
              onClick={() => onSelect(operator)}
              className="rounded-xl border border-border px-4 py-3 text-left transition-colors hover:border-primary hover:bg-primary/5"
            >
              <span className="block font-medium text-foreground">
                {operator.name}
              </span>
              <span className="block text-xs text-muted-foreground">
                {operator.code}
              </span>
            </button>
          ))}
        </div>
      )}

      <Button variant="ghost" className="mt-6" onClick={onBack}>
        Voltar
      </Button>
    </div>
  );
}
