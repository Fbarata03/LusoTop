"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
    <section id="paises" className="bg-lusotop-cream py-24 dark:bg-lusotop-navy">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Cobertura
        </p>
        <h2 className="mt-3 max-w-xl font-heading text-4xl font-semibold text-foreground sm:text-5xl">
          Países de língua portuguesa
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Os 7 países da CPLP com operadora disponível. Toca na bandeira para ver as operadoras, ou
          no resto do cartão para recarregar já.
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
                {disabled && (
                  <p className="mt-2 text-xs font-medium text-muted-foreground">
                    Em breve
                  </p>
                )}
              </>
            );

            const cardClassName = cn(
              "relative block rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition-all",
              disabled
                ? "cursor-not-allowed opacity-50"
                : "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
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
