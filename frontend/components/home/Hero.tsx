"use client";

import dynamic from "next/dynamic";
import { CheckCircle2, Clock, Mail, ShieldCheck } from "lucide-react";
import { RechargeWizard } from "@/components/recharge/RechargeWizard";

const Globe3D = dynamic(
  () => import("@/components/home/Globe3D").then((m) => m.Globe3D),
  { ssr: false }
);

const TRUST_POINTS = [
  { icon: Clock, label: "Entrega imediata" },
  { icon: ShieldCheck, label: "Sem taxas ocultas" },
  { icon: Mail, label: "Comprovativo por email" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-lusotop-navy">
      <div
        className="pointer-events-none absolute top-1/2 right-[-14%] hidden h-[560px] w-[560px] -translate-y-1/2 opacity-80 md:block lg:right-[-4%]"
        style={{
          maskImage: "radial-gradient(circle, black 55%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(circle, black 55%, transparent 78%)",
        }}
        aria-hidden="true"
      >
        <Globe3D />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <CheckCircle2 className="size-3.5" />
              Modo DEMO disponível
            </span>

            <h1 className="mt-6 font-heading text-5xl leading-[1.05] font-semibold text-white sm:text-6xl">
              Envie recargas para países de{" "}
              <span className="text-primary italic">língua portuguesa</span>
            </h1>

            <p className="mt-6 max-w-md text-lg text-white/70">
              Recargas móveis rápidas e simples, onde quer que esteja. Todos
              os países da CPLP disponíveis.
            </p>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
              {TRUST_POINTS.map((point) => (
                <span key={point.label} className="flex items-center gap-1.5">
                  <point.icon className="size-4 text-primary" />
                  {point.label}
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <RechargeWizard />
          </div>
        </div>
      </div>
    </section>
  );
}
