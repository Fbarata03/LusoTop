import Link from "next/link";
import { CPLP_COUNTRIES } from "@/lib/cplp-countries";

const PLATFORM_LINKS = [
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#paises", label: "Países disponíveis" },
  { href: "/#ajuda", label: "Ajuda / FAQ" },
  { href: "/criar-conta", label: "Criar conta" },
];

const LEGAL_LINKS = [
  { href: "/privacidade", label: "Privacidade" },
  { href: "/termos", label: "Termos de serviço" },
  { href: "/cookies", label: "Cookies" },
];

export function Footer() {
  return (
    <footer className="bg-lusotop-navy text-white/80">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-heading text-lg font-semibold text-white">
              Luso<span className="text-primary">Top</span>
            </span>
            <p className="mt-3 max-w-xs text-sm">
              Recargas simples.
              <br />
              Onde o português conecta.
            </p>
          </div>

          <FooterColumn title="Plataforma" links={PLATFORM_LINKS} />
          <FooterColumn title="Legal" links={LEGAL_LINKS} />

          <div>
            <h3 className="text-sm font-semibold text-white">Países</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {CPLP_COUNTRIES.map((country) => (
                <li key={country.isoCode}>
                  <span className="text-white/50">{country.isoCode}</span>{" "}
                  {country.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} LusoTop. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
