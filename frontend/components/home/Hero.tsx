"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Clock, Lock, ShieldCheck } from "lucide-react";
import { RechargeWizard } from "@/components/recharge/RechargeWizard";
import { FlagIcon } from "@/components/ui/flag-icon";
import { CPLP_COUNTRIES } from "@/lib/cplp-countries";

const Globe3D = dynamic(
  () => import("@/components/home/Globe3D").then((m) => m.Globe3D),
  { ssr: false }
);

const TRUST_POINTS = [
  { icon: Clock, label: "Entrega imediata" },
  { icon: ShieldCheck, label: "Sem taxas ocultas" },
  { icon: Lock, label: "Pagamento seguro via Stripe" },
];

export function Hero({ presetCountryIso }: { presetCountryIso?: string | null }) {
  return (
    <section
      className="relative overflow-hidden bg-lusotop-cream dark:bg-lusotop-navy"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 70% 60% at 10% 0%, oklch(0.32 0.1 149 / 12%), transparent 60%)",
      }}
    >
      <div className="relative mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 lg:pt-20 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="animate-in fade-in inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/60 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur duration-700">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/60" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Recargas em tempo real para a CPLP
            </span>

            <h1 className="animate-in fade-in slide-in-from-bottom-4 mt-5 font-heading text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance text-foreground duration-700 sm:text-6xl">
              Envie recargas para países de{" "}
              <span className="text-primary italic">língua portuguesa</span>
            </h1>

            <p className="animate-in fade-in slide-in-from-bottom-4 mt-6 max-w-md text-lg leading-relaxed text-muted-foreground delay-150 duration-700 fill-mode-backwards">
              Recargas móveis rápidas e simples, onde quer que esteja. Todos
              os países da CPLP disponíveis.
            </p>

            <ul className="animate-in fade-in slide-in-from-bottom-4 mt-8 flex flex-wrap gap-2 delay-300 duration-700 fill-mode-backwards">
              {TRUST_POINTS.map((point) => (
                <li
                  key={point.label}
                  className="flex items-center gap-1.5 rounded-full bg-background/70 px-3 py-1.5 text-sm font-medium text-foreground/80 shadow-sm ring-1 ring-foreground/5"
                >
                  <point.icon className="size-4 text-primary" aria-hidden="true" />
                  {point.label}
                </li>
              ))}
            </ul>

            <div className="animate-in fade-in mt-10 hidden delay-500 duration-700 fill-mode-backwards sm:block">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                Disponível em
              </p>
              <ul className="mt-3 flex flex-wrap items-center gap-2.5">
                {CPLP_COUNTRIES.map((country) => (
                  <li key={country.isoCode} title={country.name}>
                    <Link
                      href={`/paises/${country.isoCode.toLowerCase()}`}
                      className="block rounded-[4px] shadow-sm ring-1 ring-foreground/10 transition-transform hover:-translate-y-0.5"
                      aria-label={`Recarga ${country.name}`}
                    >
                      <FlagIcon isoCode={country.isoCode} className="block h-6 w-8" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div
              className="pointer-events-none absolute top-1/2 left-1/2 hidden h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-80 md:block"
              style={{
                maskImage: "radial-gradient(circle, black 55%, transparent 78%)",
                WebkitMaskImage: "radial-gradient(circle, black 55%, transparent 78%)",
              }}
              aria-hidden="true"
            >
              <Globe3D />
            </div>
            <RechargeWizard presetCountryIso={presetCountryIso} />
          </div>
        </div>
      </div>
    </section>
  );
}
