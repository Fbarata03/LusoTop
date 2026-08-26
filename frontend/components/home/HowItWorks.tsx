import {
  DestinationIllustration,
  PhoneNumberIllustration,
  PlanIllustration,
  SecurePaymentIllustration,
} from "@/components/illustrations/StepIllustrations";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    number: "01",
    illustration: DestinationIllustration,
    title: "Escolha o destino",
    description:
      "Selecione o país e a operadora do destinatário entre os 7 países da CPLP.",
  },
  {
    number: "02",
    illustration: PhoneNumberIllustration,
    title: "Introduza o número",
    description:
      "Insira o número de telefone do destinatário. Verificamos o formato automaticamente para garantir que a recarga chega ao destinatário certo.",
  },
  {
    number: "03",
    illustration: PlanIllustration,
    title: "Escolha o plano",
    description:
      "Saldo, dados móveis ou minutos de voz — selecione o tipo de plano e o valor entre as opções disponíveis. Sempre transparente, sem surpresas.",
  },
  {
    number: "04",
    illustration: SecurePaymentIllustration,
    title: "Pagamento seguro",
    description:
      "Pague de forma segura através dos nossos parceiros de pagamento. Os seus dados são protegidos por encriptação de ponta a ponta.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-lusotop-navy py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Processo
        </p>
        <h2 className="mt-3 max-w-xl font-heading text-4xl font-semibold text-white sm:text-5xl">
          Em quatro passos simples
        </h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => {
            const highlighted = i === 1;
            return (
              <div
                key={step.number}
                className={cn(
                  "relative overflow-hidden rounded-2xl border p-6 transition-all hover:-translate-y-0.5",
                  highlighted
                    ? "border-primary bg-primary text-lusotop-navy shadow-[0_20px_50px_-15px_rgba(52,211,153,0.45)] hover:bg-primary/90"
                    : "border-white/10 bg-white/5 hover:border-primary/30 hover:bg-white/[0.07]"
                )}
              >
                <span
                  className={cn(
                    "absolute top-4 right-5 font-heading text-4xl font-semibold",
                    highlighted ? "text-lusotop-navy/15" : "text-white/10"
                  )}
                >
                  {step.number}
                </span>
                <step.illustration className="h-16 w-16" />
                <h3
                  className={cn(
                    "mt-4 font-semibold",
                    highlighted ? "text-lusotop-navy" : "text-white"
                  )}
                >
                  {step.title}
                </h3>
                <p
                  className={cn(
                    "mt-2 text-sm leading-relaxed",
                    highlighted ? "text-lusotop-navy/70" : "text-white/60"
                  )}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
