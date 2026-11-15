"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCountries, ApiError } from "@/lib/api";
import type { Country } from "@/lib/types";
import { ArrowRight, RotateCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FlagIcon } from "@/components/ui/flag-icon";
import { cn } from "@/lib/utils";

export function CountriesGrid() {
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

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
  }, [attempt]);

  function retry() {
    setError(null);
    setAttempt((n) => n + 1);
  }

  return (
    <section id="paises" className="bg-lusotop-cream py-20 sm:py-24 dark:bg-lusotop-navy">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Cobertura
        </p>
        <h2 className="mt-3 max-w-xl font-heading text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
          Países de língua portuguesa
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Os 7 países da CPLP com operadora disponível. Toca na bandeira para ver as operadoras, ou
          no resto do cartão para recarregar já.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {error && (
            <div
              role="alert"
              className="col-span-full flex flex-col items-start gap-4 rounded-2xl border border-destructive/20 bg-background p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
                  <WifiOff className="size-5 text-destructive" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">Não conseguimos carregar os países</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
              <Button variant="outline" onClick={retry} className="shrink-0 rounded-full">
                <RotateCw aria-hidden="true" />
                Tentar novamente
              </Button>
            </div>
          )}

          {!countries && !error &&
            Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}

          {countries?.map((country) => {
            const disabled = country.status !== "ACTIVE";

            const cardInner = (
              <>
                <span
                  className={cn(
                    "absolute top-5 right-5 size-2 rounded-full",
                    country.status === "ACTIVE" ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />

                {disabled ? (
                  <FlagIcon isoCode={country.isoCode} className="h-7 w-10" />
                ) : (
                  <Link
                    href={`/paises/${country.isoCode.toLowerCase()}`}
                    onClick={(e) => e.stopPropagation()}
                    className="relative z-10 inline-block rounded-md focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    aria-label={`Ver operadoras de ${country.name}`}
                  >
                    <FlagIcon
                      isoCode={country.isoCode}
                      className="h-7 w-10 transition-transform hover:scale-105"
                    />
                  </Link>
                )}

                <p className="mt-3 font-semibold text-foreground">
                  {country.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {country.currencyCode} · {country.phoneCode}
                </p>
                {disabled ? (
                  <p className="mt-3 text-xs font-medium text-muted-foreground">
                    Em breve
                  </p>
                ) : (
                  <p className="mt-3 flex items-center gap-1 text-sm font-medium text-primary">
                    Recarregar
                    <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </p>
                )}
              </>
            );

            const cardClassName = cn(
              "group relative block rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all duration-200",
              disabled
                ? "cursor-not-allowed opacity-50"
                : "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            );

            if (disabled) {
              return (
                <div key={country.isoCode} className={cardClassName}>
                  {cardInner}
                </div>
              );
            }

            return (
              <Link
                key={country.isoCode}
                href={`/?pais=${country.isoCode}#recarga`}
                className={cardClassName}
              >
                {cardInner}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
