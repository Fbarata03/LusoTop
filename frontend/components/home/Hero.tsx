"use client";

import { Clock, Mail, ShieldCheck } from "lucide-react";
import { RechargeWizard } from "@/components/recharge/RechargeWizard";

const TRUST_POINTS = [
  { icon: Clock, label: "Entrega imediata" },
  { icon: ShieldCheck, label: "Sem taxas ocultas" },
  { icon: Mail, label: "Comprovativo por email" },
];

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-lusotop-navy"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 70% 60% at 10% 0%, oklch(0.32 0.1 149 / 55%), transparent 60%), radial-gradient(ellipse 65% 55% at 100% 100%, oklch(0.4 0.13 55 / 50%), transparent 60%)",
      }}
    >
      <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div>
            <h1 className="font-heading text-5xl leading-[1.05] font-semibold text-white sm:text-6xl">
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
