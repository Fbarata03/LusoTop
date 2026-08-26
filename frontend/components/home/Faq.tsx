const FAQS = [
  {
    question: "O que é o Modo DEMO?",
    answer:
      "A LusoTop está na fase 1 de desenvolvimento. Pode simular o fluxo completo de recarga para os 9 países da CPLP, mas nenhum pagamento ou recarga reais são processados enquanto não houver integração com um fornecedor de pagamento e de airtime.",
  },
  {
    question: "Preciso de criar conta para simular uma recarga?",
    answer:
      "Não. O simulador de recarga funciona sem sessão iniciada. A conta serve para, no futuro, guardar o histórico das suas recargas.",
  },
  {
    question: "Os meus dados de conta estão seguros?",
    answer:
      "Sim — ao contrário da recarga, o registo e o login não são demo. As passwords são guardadas com hash BCrypt e a sessão usa um token JWT real.",
  },
  {
    question: "Quando é que os pagamentos reais ficam disponíveis?",
    answer:
      "A integração com fornecedores de pagamento e de airtime está prevista para uma fase posterior do projeto. Vamos comunicar aqui assim que estiver disponível.",
  },
  {
    question: "Que países estão cobertos?",
    answer:
      "Os 9 Estados-Membros da CPLP: Angola, Brasil, Cabo Verde, Guiné-Bissau, Guiné Equatorial, Moçambique, Portugal, São Tomé e Príncipe, e Timor-Leste.",
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
