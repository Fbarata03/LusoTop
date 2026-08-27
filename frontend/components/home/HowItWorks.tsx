import {
  DestinationIllustration,
  PhoneNumberIllustration,
  PlanIllustration,
  SecurePaymentIllustration,
} from "@/components/illustrations/StepIllustrations";

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
      "Saldo, dados móveis ou minutos de voz: selecione o tipo de plano e o valor entre as opções disponíveis. Sempre transparente, sem surpresas.",
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
    <section id="como-funciona" className="bg-lusotop-cream py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Processo
        </p>
        <h2 className="mt-3 max-w-xl font-heading text-4xl font-semibold text-foreground sm:text-5xl">
          Em quatro passos simples
        </h2>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="relative overflow-hidden rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30"
            >
              <span className="absolute top-4 right-5 font-heading text-4xl font-semibold text-foreground/10">
                {step.number}
              </span>
              <step.illustration className="h-16 w-16" />
              <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
