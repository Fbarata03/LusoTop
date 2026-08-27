import { Zap, Lock, Globe2, BadgeCheck, ShieldQuestion, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const BENEFITS = [
  {
    icon: Zap,
    title: "Entrega rápida",
    description:
      "A recarga é processada instantaneamente após a confirmação do pagamento.",
    tone: "green",
  },
  {
    icon: Lock,
    title: "Pagamentos seguros",
    description:
      "Os seus dados financeiros são processados por provedores certificados. Nunca armazenamos dados de cartão.",
    tone: "amber",
  },
  {
    icon: Globe2,
    title: "Foco lusófono",
    description:
      "Construída especificamente para a comunidade de língua portuguesa, em Portugal, Brasil, Angola e além.",
    tone: "green",
  },
  {
    icon: BadgeCheck,
    title: "Confirmação garantida",
    description:
      "Só mostramos a recarga como concluída depois de a operadora confirmar a entrega — nunca antes.",
    tone: "amber",
  },
  {
    icon: ShieldQuestion,
    title: "Transparência total",
    description:
      "As taxas são mostradas antes do pagamento. Sem custos ocultos, sem surpresas.",
    tone: "green",
  },
  {
    icon: RotateCcw,
    title: "Reembolso automático",
    description:
      "Se a recarga não puder ser entregue depois do pagamento confirmado, o valor é devolvido automaticamente.",
    tone: "amber",
  },
] as const;

export function WhyLusoTop() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div>
          <div className="relative mb-10 h-72 w-full max-w-sm">
            <div className="absolute inset-0 rounded-[2.5rem] bg-primary/15" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-phone-2.jpg"
              alt="Utilizadora sorridente a usar o telemóvel"
              className="absolute top-0 left-0 h-56 w-44 rounded-3xl border-4 border-background object-cover shadow-lg"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/hero-phone-1.jpg"
              alt="Pessoa a enviar uma recarga pelo telemóvel"
              className="absolute right-0 bottom-0 h-52 w-40 rounded-3xl border-4 border-background object-cover shadow-lg"
            />
          </div>

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
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl transition-colors",
                  benefit.tone === "amber"
                    ? "bg-lusotop-amber/15 group-hover:bg-lusotop-amber/25"
                    : "bg-primary/10 group-hover:bg-primary/15"
                )}
              >
                <benefit.icon
                  className={cn(
                    "size-5",
                    benefit.tone === "amber" ? "text-lusotop-amber" : "text-primary"
                  )}
                  strokeWidth={1.75}
                />
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
