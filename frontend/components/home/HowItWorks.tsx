import { Globe, Smartphone, ShieldCheck, Wallet } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Globe,
    title: "Escolha o destino",
    description:
      "Selecione o país e a operadora do destinatário. Suportamos as principais redes de Angola e, em breve, de todos os países de língua portuguesa.",
  },
  {
    number: "02",
    icon: Smartphone,
    title: "Introduza o número",
    description:
      "Insira o número de telefone do destinatário. Verificamos o formato automaticamente para garantir que a recarga chega ao destinatário certo.",
  },
  {
    number: "03",
    icon: Wallet,
    title: "Escolha o valor",
    description:
      "Selecione o montante da recarga entre as opções disponíveis para a operadora escolhida. Os valores são sempre transparentes — sem surpresas.",
  },
  {
    number: "04",
    icon: ShieldCheck,
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
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <span className="absolute top-4 right-5 font-heading text-4xl font-semibold text-white/10">
                {step.number}
              </span>
              <step.icon className="size-6 text-primary" strokeWidth={1.75} />
              <h3 className="mt-4 font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
