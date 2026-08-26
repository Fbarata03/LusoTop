const FAQS = [
  {
    question: "Os pagamentos e as recargas já são reais?",
    answer:
      "A LusoTop está em pré-lançamento. Já podes percorrer o fluxo completo de recarga para os 7 países da CPLP com operadora disponível, mas a ligação ao fornecedor de airtime ainda está a ser finalizada. Por isso, mesmo com o pagamento confirmado, a recarga ainda não é enviada enquanto essa fase não abrir.",
  },
  {
    question: "Preciso de criar conta para pedir uma recarga?",
    answer:
      "Não. Podes percorrer o fluxo de recarga sem sessão iniciada. A conta serve para guardar o histórico das tuas recargas assim que os pagamentos reais estiverem ativos.",
  },
  {
    question: "Os meus dados de conta estão seguros?",
    answer:
      "Sim. O registo e o login já funcionam em produção: as passwords são guardadas com hash BCrypt e a sessão usa um token JWT real.",
  },
  {
    question: "Quando é que os pagamentos reais ficam disponíveis?",
    answer:
      "A integração com fornecedores de pagamento e de airtime está a ser finalizada. Vamos anunciar aqui assim que ficar disponível.",
  },
  {
    question: "Que países estão cobertos?",
    answer:
      "Angola, Brasil, Cabo Verde, Guiné-Bissau, Moçambique, Portugal, e São Tomé e Príncipe.",
  },
];

export function Faq() {
  return (
    <section id="ajuda" className="bg-lusotop-cream py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm font-semibold tracking-wide text-primary uppercase">
          Ajuda
        </p>
        <h2 className="mt-3 font-heading text-4xl font-semibold text-foreground sm:text-5xl">
          Perguntas frequentes
        </h2>

        <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-background">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group p-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-foreground marker:content-none">
                {faq.question}
                <span className="shrink-0 text-xl text-muted-foreground transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
