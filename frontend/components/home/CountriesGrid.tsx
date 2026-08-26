"use client";

import { useEffect, useState } from "react";
import { fetchCountries, ApiError } from "@/lib/api";
import type { Country } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { FlagIcon } from "@/components/ui/flag-icon";
import { cn } from "@/lib/utils";

export function CountriesGrid() {
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCountries()
      .then((data) => {
        if (!cancelled) setCountries(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Não foi possível carregar os países."
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="paises" className="bg-lusotop-cream py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Cobertura
        </p>
        <h2 className="mt-3 max-w-xl font-heading text-4xl font-semibold text-foreground sm:text-5xl">
          Países de língua portuguesa
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Os 7 países da CPLP com operadora disponível.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {error && (
            <p className="col-span-full rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </p>
          )}

          {!countries && !error &&
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}

          {countries?.map((country, i) => {
            const highlighted = i === 0 && country.status === "ACTIVE";
            return (
              <div
                key={country.isoCode}
                className={cn(
                  "relative rounded-2xl border p-5 shadow-sm transition-all hover:-translate-y-0.5",
                  highlighted
                    ? "border-primary bg-primary text-lusotop-navy shadow-[0_18px_40px_-18px_rgba(52,211,153,0.5)] hover:shadow-[0_22px_46px_-16px_rgba(52,211,153,0.55)]"
                    : "border-border bg-white hover:border-primary/40 hover:shadow-md"
                )}
              >
                <span
                  className={cn(
                    "absolute top-5 right-5 size-2 rounded-full",
                    country.status !== "ACTIVE"
                      ? "bg-muted-foreground/30"
                      : highlighted
                        ? "bg-lusotop-navy/40"
                        : "bg-primary"
                  )}
                />
                <FlagIcon isoCode={country.isoCode} className="h-7 w-10 shadow-sm" />
                <p
                  className={cn(
                    "mt-3 font-semibold",
                    highlighted ? "text-lusotop-navy" : "text-foreground"
                  )}
                >
                  {country.name}
                </p>
                <p
                  className={cn(
                    "text-sm",
                    highlighted ? "text-lusotop-navy/70" : "text-muted-foreground"
                  )}
                >
                  {country.currencyCode} · {country.phoneCode}
                </p>
                {country.status !== "ACTIVE" && (
                  <p className="mt-2 text-xs font-medium text-muted-foreground">
                    Em breve
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
