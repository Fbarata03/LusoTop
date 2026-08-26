import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CountriesGrid } from "@/components/home/CountriesGrid";
import { WhyLusoTop } from "@/components/home/WhyLusoTop";
import { Faq } from "@/components/home/Faq";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <CountriesGrid />
        <WhyLusoTop />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
