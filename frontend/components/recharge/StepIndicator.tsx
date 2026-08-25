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
    <div className="flex border-b border-border px-1 pt-2">
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
                "flex items-center justify-center rounded-full font-bold transition-all",
                isActive &&
                  "size-7 bg-primary text-sm text-primary-foreground shadow-[0_0_0_5px_rgba(52,211,153,0.18),0_4px_14px_-2px_rgba(16,185,129,0.55)]",
                isDone && "size-5 bg-primary text-[11px] text-primary-foreground",
                !isActive && !isDone && "size-5 bg-muted text-[11px] text-muted-foreground"
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
