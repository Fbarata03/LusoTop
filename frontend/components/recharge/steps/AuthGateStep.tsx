"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";

export function AuthGateStep({
  onSuccess,
  onBack,
}: {
  onSuccess: () => void;
  onBack: () => void;
}) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === "register" && password.length < 8) {
      setError("A password deve ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onSuccess();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : mode === "login"
            ? "Não foi possível entrar."
            : "Não foi possível criar a conta."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="flex items-center gap-2 font-heading text-2xl font-bold text-foreground">
        <span className="h-6 w-1.5 rounded-full bg-primary" />
        Entra ou cria conta para continuar
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        A tua recarga fica guardada — não perdes nada do que já escolheste.
      </p>

      <div className="mt-4 flex gap-1.5 rounded-xl bg-muted p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            mode === "login" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          Entrar
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all ${
            mode === "register" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
          }`}
        >
          Criar conta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        {mode === "register" && (
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="auth-name">
              Nome
            </label>
            <Input
              id="auth-name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground" htmlFor="auth-email">
            Email
          </label>
          <Input
            id="auth-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground" htmlFor="auth-password">
            Password
          </label>
          <Input
            id="auth-password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {mode === "register" && (
            <p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading
            ? mode === "login"
              ? "A entrar…"
              : "A criar conta…"
            : mode === "login"
              ? "Entrar e continuar"
              : "Criar conta e continuar"}
        </Button>
      </form>

      <Button variant="ghost" className="mt-4" onClick={onBack} disabled={loading}>
        Voltar
      </Button>
    </div>
  );
}
