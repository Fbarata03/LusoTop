"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CountriesGrid } from "@/components/home/CountriesGrid";
import { WhyLusoTop } from "@/components/home/WhyLusoTop";
import { Faq } from "@/components/home/Faq";

function HomeContent() {
  const searchParams = useSearchParams();
  const presetCountryIso = searchParams.get("pais");

  useEffect(() => {
    // Ao chegar de /paises/xx ou de um cartão da grelha de países com ?pais=XX#recarga, faz
    // scroll ate ao wizard -- o navegador ja tenta ir para a ancora #recarga sozinho, mas isto
    // garante mesmo quando o conteudo ainda esta a carregar por cima.
    if (!presetCountryIso) return;
    const target = document.getElementById("recarga");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [presetCountryIso]);

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <Hero presetCountryIso={presetCountryIso} />
        <HowItWorks />
        <CountriesGrid />
        <WhyLusoTop />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex flex-1 flex-col" />}>
      <HomeContent />
    </Suspense>
  );
}
