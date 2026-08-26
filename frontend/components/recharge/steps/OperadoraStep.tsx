"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FlagIcon } from "@/components/ui/flag-icon";
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
      <h3 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
        <span className="h-6 w-1.5 rounded-full bg-primary" />
        Qual a operadora?
      </h3>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <FlagIcon isoCode={country.isoCode} className="h-4 w-[22px]" />
        Recarga para {country.name}.
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
              className="flex items-center gap-3 rounded-xl border border-border px-4 py-3 text-left transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm active:scale-[0.98]"
            >
              <OperatorLogo name={operator.name} logoUrl={operator.logoUrl} />
              <span className="min-w-0">
                <span className="block truncate font-medium text-foreground">
                  {operator.name}
                </span>
                <span className="block text-xs text-muted-foreground">
                  {operator.code}
                </span>
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

function OperatorLogo({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl: string | null;
}) {
  const [failed, setFailed] = useState(false);

  if (!logoUrl || failed) {
    return (
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={logoUrl}
      alt={name}
      className="size-9 shrink-0 rounded-full border border-border bg-white object-contain p-1"
      onError={() => setFailed(true)}
    />
  );
}
