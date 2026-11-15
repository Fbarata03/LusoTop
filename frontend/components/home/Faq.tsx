import { Plus } from "lucide-react";

const FAQS = [
  {
    question: "Os pagamentos e as recargas já são reais?",
    answer:
      "Sim. O pagamento é processado pela Stripe e a recarga é enviada de imediato através da DingConnect, o nosso fornecedor de airtime, para os 7 países da CPLP.",
  },
  {
    question: "Preciso de criar conta para pedir uma recarga?",
    answer:
      "Podes escolher país, operadora, número e valor sem conta. Antes de pagar, pedimos para entrares ou criares conta. A recarga que já escolheste fica guardada e continuas exatamente onde ficaste.",
  },
  {
    question: "Os meus dados de conta estão seguros?",
    answer:
      "Sim. O registo e o login já funcionam em produção: as passwords são guardadas com hash BCrypt e a sessão usa um token JWT real.",
  },
  {
    question: "E se o pagamento for feito mas a recarga falhar?",
    answer:
      "Isso é raro, mas se acontecer, o valor pago é reembolsado automaticamente através da Stripe. Não fica a tua conta a descoberto sem recarga.",
  },
  {
    question: "Que países estão cobertos?",
    answer:
      "Angola, Brasil, Cabo Verde, Guiné-Bissau, Moçambique, Portugal, e São Tomé e Príncipe.",
  },
];

export function Faq() {
  return (
    <section id="ajuda" className="bg-lusotop-cream py-20 sm:py-24 dark:bg-lusotop-navy">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Ajuda
        </p>
        <h2 className="mt-3 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Perguntas frequentes
        </h2>

        <div className="mt-10 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group">
              <summary className="flex min-h-14 list-none items-center justify-between gap-4 px-6 py-5 font-medium text-foreground transition-colors marker:content-none hover:bg-lusotop-cream/40 [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform duration-200 group-open:rotate-45">
                  <Plus className="size-4" aria-hidden="true" />
                </span>
              </summary>
              <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
