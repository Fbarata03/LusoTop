import { Zap, Lock, Globe2, BadgeCheck, ShieldQuestion, MessageCircle } from "lucide-react";
import { ConnectionIllustration } from "@/components/illustrations/ConnectionIllustration";

const BENEFITS = [
  {
    icon: Zap,
    title: "Entrega rápida",
    description:
      "A recarga é processada instantaneamente após a confirmação do pagamento.",
  },
  {
    icon: Lock,
    title: "Pagamentos seguros",
    description:
      "Os seus dados financeiros são processados por provedores certificados. Nunca armazenamos dados de cartão.",
  },
  {
    icon: Globe2,
    title: "Foco lusófono",
    description:
      "Construída especificamente para a comunidade de língua portuguesa — em Portugal, Brasil, Angola e além.",
  },
  {
    icon: BadgeCheck,
    title: "Confirmação garantida",
    description:
      "Recebe um comprovativo por email para cada recarga. Rastreie o estado de todas as suas transações.",
  },
  {
    icon: ShieldQuestion,
    title: "Transparência total",
    description:
      "As taxas são mostradas antes do pagamento. Sem custos ocultos, sem surpresas.",
  },
  {
    icon: MessageCircle,
    title: "Suporte dedicado",
    description:
      "A nossa equipa fala português e está disponível para ajudar em qualquer dificuldade.",
  },
];

export function WhyLusoTop() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <ConnectionIllustration className="mb-8 h-auto w-full max-w-sm" />

          <p className="text-sm font-semibold tracking-wide text-primary uppercase">
            Porquê LusoTop
          </p>
          <h2 className="mt-3 font-heading text-4xl font-semibold text-foreground sm:text-5xl">
            Construída para{" "}
            <span className="italic text-primary">a comunidade lusófona</span>
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            A LusoTop foi criada com um único objetivo: tornar as recargas
            internacionais tão simples quanto possível para os milhões de
            pessoas que falam português em todo o mundo.
          </p>

          <div className="mt-8 flex items-center gap-4 rounded-2xl bg-muted p-5">
            <span className="font-heading text-4xl font-semibold text-foreground">
              100%
            </span>
            <span className="text-sm text-muted-foreground">
              das recargas são confirmadas antes de apresentarmos o resultado
              ao utilizador.
            </span>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="group">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                <benefit.icon className="size-5 text-primary" strokeWidth={1.75} />
              </span>
              <h3 className="mt-3 font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
