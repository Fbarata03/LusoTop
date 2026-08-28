"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ApiError, forgotPassword } from "@/lib/api";

export default function EsqueciPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível enviar o email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-lusotop-cream px-4 py-16 dark:bg-lusotop-navy">
        <Card className="w-full max-w-sm p-6">
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Esqueci-me da password
          </h1>

          {sent ? (
            <>
              <p className="mt-3 text-sm text-muted-foreground">
                Se existir uma conta com esse email, foi enviado um link para redefinires a
                password. Verifica a tua caixa de entrada (e o spam).
              </p>
              <Button className="mt-6 w-full" render={<Link href="/entrar" />}>
                Voltar a entrar
              </Button>
            </>
          ) : (
            <>
              <p className="mt-1 text-sm text-muted-foreground">
                Introduz o teu email e enviamos-te um link para escolheres uma password nova.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground" htmlFor="email">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "A enviar…" : "Enviar link"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link href="/entrar" className="font-medium text-primary hover:underline">
                  Voltar a entrar
                </Link>
              </p>
            </>
          )}
        </Card>
      </main>
      <Footer />
    </div>
  );
}
