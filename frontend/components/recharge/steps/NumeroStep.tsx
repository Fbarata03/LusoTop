"use client";

import { FormEvent, useState } from "react";
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Country } from "@/lib/types";

export function NumeroStep({
  country,
  initialValue,
  onSubmit,
  onBack,
}: {
  country: Country;
  initialValue: string;
  onSubmit: (phoneNumber: string) => void;
  onBack: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const parsed = parsePhoneNumberFromString(
      value,
      country.isoCode as CountryCode
    );

    if (!parsed || !parsed.isValid()) {
      setError(
        `Número inválido para ${country.name}. Confirme o formato e tente novamente.`
      );
      return;
    }

    setError(null);
    onSubmit(parsed.number);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="font-heading text-xl font-semibold text-foreground">
        Qual o número de telefone?
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Número do destinatário em {country.name} ({country.phoneCode}).
      </p>

      <div className="mt-4 flex gap-2">
        <span className="flex items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground">
          {country.phoneCode}
        </span>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="912 345 678"
          inputMode="tel"
          autoFocus
        />
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

      <div className="mt-6 flex items-center gap-3">
        <Button type="button" variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" disabled={value.trim().length === 0}>
          Continuar
        </Button>
      </div>
    </form>
  );
}
