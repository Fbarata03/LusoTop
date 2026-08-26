"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CanceladaPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-lusotop-cream px-4 py-16">
        <Card className="w-full max-w-md p-6 text-center">
          <XCircle className="mx-auto size-10 text-muted-foreground" />
          <h1 className="mt-4 font-heading text-xl font-semibold text-foreground">
            Pagamento cancelado
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Não te foi cobrado nenhum valor. Podes tentar de novo quando quiseres.
          </p>
          <Button render={<Link href="/" />} className="mt-6 w-full">
            Voltar ao início
          </Button>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
