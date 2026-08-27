"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/transacoes", label: "Transações" },
  { href: "/admin/clientes", label: "Clientes" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user || user.role !== "ADMIN") {
      router.push("/");
    }
  }, [loading, user, router]);

  if (loading || !user || user.role !== "ADMIN") {
    return (
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex flex-1 items-center justify-center bg-lusotop-cream py-24 dark:bg-lusotop-navy">
          <Loader2 className="size-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1 bg-lusotop-cream px-4 py-10 dark:bg-lusotop-navy">
        <div className="mx-auto max-w-5xl">
          <nav className="flex gap-1.5 rounded-xl bg-muted p-1">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 rounded-lg py-2 text-center text-sm font-medium transition-all",
                  pathname === item.href
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
