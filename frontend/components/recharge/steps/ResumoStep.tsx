"use client";

import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Country, Operator, Product } from "@/lib/types";

export function ResumoStep({
  country,
  operator,
  phoneNumber,
  product,
  onBack,
  onRestart,
}: {
  country: Country;
  operator: Operator;
  phoneNumber: string;
  product: Product;
  onBack: () => void;
  onRestart: () => void;
}) {
  return (
    <div>
      <h3 className="font-heading text-xl font-semibold text-foreground">
        Confirme os dados da recarga
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Reveja tudo antes de avançar para o pagamento.
      </p>

      <dl className="mt-5 space-y-3 text-sm">
        <Row label="Destino" value={`${country.flagEmoji} ${country.name}`} />
        <Row label="Operadora" value={operator.name} />
        <Row label="Número" value={phoneNumber} />
        <Row
          label="Valor"
          value={`${product.amount.toLocaleString("pt-PT")} ${product.currency}`}
        />
      </dl>

      <Separator className="my-5" />

      <div className="flex gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-primary" />
        <p>
          <strong>Modo DEMO.</strong> Esta plataforma ainda está em
          desenvolvimento — nenhum pagamento real será processado e nenhuma
          recarga será enviada. O fluxo de pagamento entra numa fase
          posterior.
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button variant="ghost" onClick={onBack}>
          Voltar
        </Button>
        <Button onClick={onRestart}>Fazer outra simulação</Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
