"use client";

import { FormEvent, useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { parsePhoneNumberFromString, type CountryCode } from "libphonenumber-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Country } from "@/lib/types";
import { cn } from "@/lib/utils";

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
  const [touched, setTouched] = useState(false);

  const parsed = useMemo(
    () => parsePhoneNumberFromString(value, country.isoCode as CountryCode),
    [value, country.isoCode]
  );
  const isValid = !!parsed?.isValid();
  const showInvalid = touched && value.trim().length > 0 && !isValid;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!isValid || !parsed) return;
    onSubmit(parsed.number);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
        <span className="h-6 w-1.5 rounded-full bg-primary" />
        Qual o número de telefone?
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Número do destinatário em {country.name} ({country.phoneCode}).
      </p>

      <div className="mt-4 flex gap-2">
        <span className="flex items-center rounded-md border border-border bg-muted px-3 text-sm text-muted-foreground">
          {country.phoneCode}
        </span>
        <div className="relative flex-1">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="912 345 678"
            inputMode="tel"
            autoFocus
            aria-invalid={showInvalid}
            className={cn(
              "pr-9",
              isValid && "border-primary focus-visible:ring-primary/40",
              showInvalid && "border-destructive focus-visible:ring-destructive/40"
            )}
          />
          {value.trim().length > 0 && (
            <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
              {isValid ? (
                <CheckCircle2 className="size-4 text-primary" />
              ) : showInvalid ? (
                <XCircle className="size-4 text-destructive" />
              ) : null}
            </span>
          )}
        </div>
      </div>

      <p
        className={cn(
          "mt-2 min-h-5 text-sm transition-colors",
          isValid && "text-primary",
          showInvalid && "text-destructive"
        )}
      >
        {isValid
          ? "Número válido."
          : showInvalid
            ? `Número inválido para ${country.name}. Confirme o formato e tente novamente.`
            : null}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <Button type="button" variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <Button type="submit" disabled={!isValid}>
          Continuar
        </Button>
      </div>
    </form>
  );
}
