"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { StepIndicator } from "./StepIndicator";
import { DestinoStep } from "./steps/DestinoStep";
import { OperadoraStep } from "./steps/OperadoraStep";
import { NumeroStep } from "./steps/NumeroStep";
import { ValorStep } from "./steps/ValorStep";
import { ResumoStep } from "./steps/ResumoStep";
import type { Country, Operator, Product } from "@/lib/types";

interface WizardState {
  step: number;
  country: Country | null;
  operator: Operator | null;
  phoneNumber: string;
  product: Product | null;
}

const INITIAL_STATE: WizardState = {
  step: 1,
  country: null,
  operator: null,
  phoneNumber: "",
  product: null,
};

export function RechargeWizard() {
  const [state, setState] = useState<WizardState>(INITIAL_STATE);

  return (
    <Card
      className={cn(
        "wizard-dark w-full max-w-md overflow-hidden gap-0 rounded-[28px] border-0 bg-background/90 py-0",
        "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.08),0_20px_70px_-15px_rgba(52,211,153,0.3)]",
        "ring-1 ring-white/10 backdrop-blur-xl",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px]",
        "before:bg-gradient-to-br before:from-primary/[0.1] before:via-transparent before:to-transparent",
        "relative"
      )}
    >
      <div className="relative bg-gradient-to-b from-primary/[0.12] to-transparent">
        <StepIndicator current={state.step} />
      </div>

      <div className="relative p-6">
        {state.step === 1 && (
          <DestinoStep
            onSelect={(country) =>
              setState((s) => ({ ...s, step: 2, country }))
            }
          />
        )}

        {state.step === 2 && state.country && (
          <OperadoraStep
            key={state.country.isoCode}
            country={state.country}
            onSelect={(operator) =>
              setState((s) => ({ ...s, step: 3, operator }))
            }
            onBack={() => setState((s) => ({ ...s, step: 1 }))}
          />
        )}

        {state.step === 3 && state.country && (
          <NumeroStep
            country={state.country}
            initialValue={state.phoneNumber}
            onSubmit={(phoneNumber) =>
              setState((s) => ({ ...s, step: 4, phoneNumber }))
            }
            onBack={() => setState((s) => ({ ...s, step: 2 }))}
          />
        )}

        {state.step === 4 && state.operator && (
          <ValorStep
            operator={state.operator}
            onSelect={(product) =>
              setState((s) => ({ ...s, step: 5, product }))
            }
            onBack={() => setState((s) => ({ ...s, step: 3 }))}
          />
        )}

        {state.step === 5 &&
          state.country &&
          state.operator &&
          state.product && (
            <ResumoStep
              country={state.country}
              operator={state.operator}
              phoneNumber={state.phoneNumber}
              product={state.product}
              onBack={() => setState((s) => ({ ...s, step: 4 }))}
              onRestart={() => setState(INITIAL_STATE)}
            />
          )}
      </div>
    </Card>
  );
}
