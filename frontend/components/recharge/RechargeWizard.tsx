"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
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
    <Card className="w-full max-w-md overflow-hidden py-0 gap-0">
      <StepIndicator current={state.step} />

      <div className="p-6">
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
