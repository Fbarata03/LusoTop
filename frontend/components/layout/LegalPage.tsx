import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1 bg-background px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-heading text-4xl font-bold text-foreground">{title}</h1>
          <div className="prose mt-6 max-w-none text-muted-foreground">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
