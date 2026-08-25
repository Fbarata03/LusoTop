"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { FlagIcon } from "@/components/ui/flag-icon";
import { fetchCountries, ApiError } from "@/lib/api";
import type { Country } from "@/lib/types";
import { cn } from "@/lib/utils";

export function DestinoStep({
  onSelect,
}: {
  onSelect: (country: Country) => void;
}) {
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

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

  const filtered = useMemo(() => {
    if (!countries) return [];
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [countries, query]);

  return (
    <div>
      <h3 className="font-heading text-xl font-semibold text-foreground">
        Para onde quer enviar?
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Escolha o país de destino da recarga.
      </p>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar país..."
          className="pl-9"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {!countries &&
          !error &&
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}

        {filtered.map((country) => {
          const disabled = country.status !== "ACTIVE";
          return (
            <button
              key={country.isoCode}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(country)}
              className={cn(
                "flex items-center justify-between rounded-xl border border-border px-4 py-3 text-left transition-all",
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "hover:border-primary hover:bg-primary/5 hover:shadow-sm active:scale-[0.98]"
              )}
            >
              <span className="flex items-center gap-3">
                <FlagIcon isoCode={country.isoCode} className="h-6 w-8 shrink-0" />
                <span>
                  <span className="block text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {country.isoCode}
                  </span>
                  <span className="block font-medium text-foreground">
                    {country.name}
                  </span>
                </span>
              </span>
              {disabled ? (
                <span className="text-xs text-muted-foreground">Em breve</span>
              ) : (
                <span className="text-xs text-muted-foreground">
                  {country.currencyCode}
                </span>
              )}
            </button>
          );
        })}

        {countries && filtered.length === 0 && (
          <p className="col-span-full py-6 text-center text-sm text-muted-foreground">
            Nenhum país encontrado para &ldquo;{query}&rdquo;.
          </p>
        )}
      </div>
    </div>
  );
}
