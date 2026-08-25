"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, User as UserIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#como-funciona", label: "Como funciona" },
  { href: "#paises", label: "Países" },
  { href: "#ajuda", label: "Ajuda" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    setOpen(false);
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-lusotop-navy">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ShieldIcon className="size-4" />
          </span>
          <span className="font-heading text-lg font-semibold text-white">
            Luso<span className="text-primary">Top</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-white/80 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!loading && user ? (
            <div className="hidden items-center gap-3 sm:flex">
              <span className="flex items-center gap-1.5 text-sm text-white/80">
                <UserIcon className="size-4 text-primary" />
                {user.name.split(" ")[0]}
              </span>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-white hover:bg-white/10 hover:text-white"
              >
                Sair
              </Button>
            </div>
          ) : (
            !loading && (
              <>
                <Link
                  href="/entrar"
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "hidden text-white hover:bg-white/10 hover:text-white sm:inline-flex"
                  )}
                >
                  Entrar
                </Link>
                <Link
                  href="/criar-conta"
                  className={cn(buttonVariants(), "hidden rounded-full sm:inline-flex")}
                >
                  Criar conta
                </Link>
              </>
            )
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-expanded={open}
            className="flex size-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 bg-lusotop-navy px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm text-white/80 transition-colors hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-2 flex gap-2 border-t border-white/10 pt-3">
            {user ? (
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="flex-1 text-white hover:bg-white/10 hover:text-white"
              >
                Sair ({user.name.split(" ")[0]})
              </Button>
            ) : (
              <>
                <Link
                  href="/entrar"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "flex-1 text-white hover:bg-white/10 hover:text-white"
                  )}
                >
                  Entrar
                </Link>
                <Link
                  href="/criar-conta"
                  onClick={() => setOpen(false)}
                  className={cn(buttonVariants(), "flex-1 rounded-full")}
                >
                  Criar conta
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
