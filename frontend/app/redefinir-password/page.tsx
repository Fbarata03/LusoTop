"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ApiError, resetPassword } from "@/lib/api";

function RedefinirPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("As passwords não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token!, password);
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Não foi possível redefinir a password.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <Card className="w-full max-w-sm p-6 text-center">
        <XCircle className="mx-auto size-10 text-destructive" />
        <h1 className="mt-4 font-heading text-xl font-semibold text-foreground">
          Link inválido
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Este link de redefinição de password está incompleto ou inválido.
        </p>
        <Button className="mt-6 w-full" render={<Link href="/esqueci-password" />}>
          Pedir um novo link
        </Button>
      </Card>
    );
  }

  if (done) {
    return (
      <Card className="w-full max-w-sm p-6 text-center">
        <CheckCircle2 className="mx-auto size-10 text-primary" />
        <h1 className="mt-4 font-heading text-xl font-semibold text-foreground">
          Password redefinida
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Já podes entrar com a tua password nova.
        </p>
        <Button className="mt-6 w-full" onClick={() => router.push("/entrar")}>
          Entrar
        </Button>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm p-6">
      <h1 className="font-heading text-2xl font-semibold text-foreground">
        Escolhe uma password nova
      </h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground" htmlFor="password">
            Password nova
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground" htmlFor="confirmPassword">
            Confirmar password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "A guardar…" : "Guardar password"}
        </Button>
      </form>
    </Card>
  );
}

export default function RedefinirPasswordPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center bg-lusotop-cream px-4 py-16 dark:bg-lusotop-navy">
        <Suspense fallback={<Loader2 className="size-10 animate-spin text-primary" />}>
          <RedefinirPasswordContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
