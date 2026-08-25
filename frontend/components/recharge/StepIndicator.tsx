import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const WIZARD_STEPS = [
  "Destino",
  "Operadora",
  "Número",
  "Valor",
  "Resumo",
] as const;

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex border-b border-border">
      {WIZARD_STEPS.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === current;
        const isDone = stepNumber < current;

        return (
          <div
            key={label}
            className={cn(
              "flex flex-1 flex-col items-center gap-1.5 border-b-2 py-3 text-xs transition-colors",
              isActive || isDone ? "border-primary" : "border-transparent"
            )}
          >
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
                isActive && "bg-primary text-primary-foreground ring-4 ring-primary/15",
                isDone && "bg-primary text-primary-foreground",
                !isActive && !isDone && "bg-muted text-muted-foreground"
              )}
            >
              {isDone ? <Check className="size-3" /> : stepNumber}
            </span>
            <span
              className={cn(
                "hidden font-medium transition-colors sm:inline",
                isActive || isDone ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
