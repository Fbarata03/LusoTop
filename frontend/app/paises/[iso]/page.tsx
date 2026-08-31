import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlagIcon } from "@/components/ui/flag-icon";
import { COUNTRY_SEO, SEO_COUNTRY_ISOS } from "@/lib/country-seo";

const SITE_URL = "https://lusotop.online";

export function generateStaticParams() {
  return SEO_COUNTRY_ISOS.map((iso) => ({ iso: iso.toLowerCase() }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ iso: string }>;
}): Promise<Metadata> {
  const { iso } = await params;
  const c = COUNTRY_SEO[iso.toUpperCase()];
  if (!c) return {};

  const title = `Recarga de saldo para ${c.name} online — ${c.operators
    .slice(0, 3)
    .join(", ")}`;
  const description = `${c.intro} Pagamento seguro, sem taxas escondidas, comprovativo por email.`;
  const url = `${SITE_URL}/paises/${c.iso.toLowerCase()}`;

  return {
    title,
    description,
    keywords: [
      `recarga ${c.name}`,
      `recarregar saldo ${c.name}`,
      `carregar telemóvel ${c.name}`,
      `recarga de saldo ${c.ofName}`,
      ...c.operators.map((o) => `recarga ${o}`),
      "recarga online",
      "top-up",
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "LusoTop",
      locale: "pt_PT",
      type: "website",
    },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ iso: string }>;
}) {
  const { iso } = await params;
  const c = COUNTRY_SEO[iso.toUpperCase()];
  if (!c) notFound();

  const faq = [
    {
      q: `Como recarregar saldo para ${c.name}?`,
      a: `Escolha ${c.name} no formulário, indique o número (${c.phoneCode}), selecione a operadora e o valor, e pague com cartão. O saldo é entregue na hora.`,
    },
    {
      q: `Quais as operadoras suportadas ${c.ofName}?`,
      a: `A LusoTop suporta ${c.operators.join(", ")}.`,
    },
    {
      q: `Quanto tempo demora a recarga a chegar?`,
      a: `Normalmente segundos. Se a entrega falhar, o pagamento é devolvido automaticamente.`,
    },
    {
      q: `Posso recarregar um número ${c.ofName} a partir de outro país?`,
      a: `Sim. A LusoTop funciona a partir de qualquer país e o pagamento é sempre em euros.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: `Recarga ${c.name}`,
            item: `${SITE_URL}/paises/${c.iso.toLowerCase()}`,
          },
        ],
      },
      {
        "@type": "Service",
        serviceType: `Recarga de saldo móvel para ${c.name}`,
        provider: { "@type": "Organization", name: "LusoTop", url: SITE_URL },
        areaServed: { "@type": "Country", name: c.name },
        description: c.intro,
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />
      <main className="flex-1 bg-lusotop-cream px-4 py-16 dark:bg-lusotop-navy">
        <div className="mx-auto max-w-2xl">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Voltar ao início
          </Link>

          <div className="mt-6 flex items-center gap-4">
            <FlagIcon isoCode={c.iso} className="h-10 w-14 rounded-md" />
            <div>
              <h1 className="font-heading text-3xl font-semibold text-foreground">
                Recarga de saldo para {c.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {c.currencyCode} · {c.phoneCode} · entrega imediata
              </p>
            </div>
          </div>

          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            {c.intro}
          </p>

          <Button
            className="mt-6 w-full sm:w-auto"
            render={<Link href={`/?pais=${c.iso}#recarga`} />}
          >
            Recarregar para {c.name} agora
          </Button>

          <section className="mt-10">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Operadoras {c.ofName}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Carregue saldo para qualquer uma destas operadoras móveis:
            </p>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {c.operators.map((operator) => (
                <Card key={operator} className="p-4 font-medium text-foreground">
                  {operator}
                </Card>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Como recarregar saldo para {c.name}
            </h2>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">1.</strong> Escolha {c.name} e
                introduza o número de telemóvel ({c.phoneCode}).
              </li>
              <li>
                <strong className="text-foreground">2.</strong> Selecione a operadora
                ({c.operators.join(", ")}) e o valor da recarga.
              </li>
              <li>
                <strong className="text-foreground">3.</strong> Pague com cartão em
                euros. O saldo chega ao telemóvel em segundos e recebe o comprovativo
                por email.
              </li>
            </ol>
          </section>

          <section className="mt-10">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Perguntas frequentes
            </h2>
            <div className="mt-4 space-y-4">
              {faq.map((f) => (
                <div key={f.q}>
                  <h3 className="text-sm font-semibold text-foreground">{f.q}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
