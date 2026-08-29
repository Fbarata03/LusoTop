"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlagIcon } from "@/components/ui/flag-icon";
import { OperatorLogo } from "@/components/ui/operator-logo";
import { fetchCountries, fetchOperatorsByCountry, ApiError } from "@/lib/api";
import type { Country, Operator } from "@/lib/types";

export function CountryPageContent({ iso }: { iso: string }) {
  const [country, setCountry] = useState<Country | null>(null);
  const [operators, setOperators] = useState<Operator[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchCountries()
      .then((countries) => {
        if (cancelled) return;
        const match = countries.find((c) => c.isoCode === iso);
        if (!match) {
          setError("País não encontrado.");
          return;
        }
        setCountry(match);
        return fetchOperatorsByCountry(match.isoCode);
      })
      .then((ops) => {
        if (!cancelled && ops) setOperators(ops);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : "Não foi possível carregar o país.");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [iso]);

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1 bg-lusotop-cream px-4 py-16 dark:bg-lusotop-navy">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar ao início
          </Link>

          {error && (
            <p className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              {error}
            </p>
          )}

          {!country && !error && (
            <div className="flex justify-center py-24">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          )}

          {country && (
            <>
              <div className="mt-6 flex items-center gap-4">
                <FlagIcon isoCode={country.isoCode} className="h-10 w-14 rounded-md" />
                <div>
                  <h1 className="font-heading text-3xl font-semibold text-foreground">
                    {country.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    {country.currencyCode} · {country.phoneCode}
                  </p>
                </div>
              </div>

              <Button
                className="mt-6 w-full sm:w-auto"
                render={<Link href={`/?pais=${country.isoCode}#recarga`} />}
              >
                Recarregar para {country.name}
              </Button>

              <div className="mt-10">
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  Operadoras disponíveis
                </h2>

                {!operators && (
                  <div className="mt-4 flex justify-center py-8">
                    <Loader2 className="size-6 animate-spin text-primary" />
                  </div>
                )}

                {operators && operators.length === 0 && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Ainda não há operadoras disponíveis para este país.
                  </p>
                )}

                {operators && operators.length > 0 && (
                  <div className="mt-4 space-y-2.5">
                    {operators.map((operator) => (
                      <Card key={operator.id} className="flex items-center gap-3 p-4">
                        <OperatorLogo
                          name={operator.name}
                          logoUrl={operator.logoUrl}
                          className="size-9 text-sm"
                        />
                        <span className="font-medium text-foreground">{operator.name}</span>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
