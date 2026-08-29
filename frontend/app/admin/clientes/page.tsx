"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ApiError, fetchAdminCustomers } from "@/lib/api";
import type { AdminCustomer } from "@/lib/api";

const EUR = (value: number) =>
  value.toLocaleString("pt-PT", { style: "currency", currency: "EUR" });

export default function AdminClientesPage() {
  const [customers, setCustomers] = useState<AdminCustomer[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAdminCustomers()
      .then(setCustomers)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Não foi possível carregar."));
  }, []);

  const filtered = useMemo(() => {
    if (!customers) return [];
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    );
  }, [customers, search]);

  return (
    <AdminShell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Clientes</h1>
        {customers && (
          <p className="text-sm text-muted-foreground">
            {filtered.length} de {customers.length}
          </p>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!customers && !error && (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      )}

      {customers && (
        <>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome ou email…"
              className="pl-9"
            />
          </div>

          {/* Telemóvel: cartões */}
          <div className="mt-4 space-y-3 lg:hidden">
            {filtered.map((customer) => (
              <Card key={customer.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{customer.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{customer.email}</p>
                  </div>
                  <p className="shrink-0 font-heading text-base font-semibold text-foreground">
                    {EUR(customer.totalSpentEur)}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{customer.orderCount} recarga(s)</span>
                  <span>
                    Última atividade: {new Date(customer.lastActivity).toLocaleDateString("pt-PT")}
                  </span>
                </div>
              </Card>
            ))}
            {filtered.length === 0 && (
              <p className="rounded-xl border border-border bg-background p-6 text-center text-sm text-muted-foreground">
                Nenhum cliente encontrado.
              </p>
            )}
          </div>

          {/* Ecrã largo: tabela */}
          <div className="mt-4 hidden overflow-x-auto rounded-xl border border-border bg-background lg:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border text-xs text-muted-foreground uppercase">
                <tr>
                  <th className="p-3 font-medium">Nome</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Registo</th>
                  <th className="p-3 font-medium">Recargas</th>
                  <th className="p-3 font-medium">Total gasto</th>
                  <th className="p-3 font-medium">Última atividade</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((customer) => (
                  <tr key={customer.id} className="border-b border-border last:border-0">
                    <td className="p-3 font-medium text-foreground">{customer.name}</td>
                    <td className="p-3 text-muted-foreground">{customer.email}</td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(customer.createdAt).toLocaleDateString("pt-PT")}
                    </td>
                    <td className="p-3 text-foreground">{customer.orderCount}</td>
                    <td className="p-3 text-foreground">{EUR(customer.totalSpentEur)}</td>
                    <td className="p-3 text-muted-foreground">
                      {new Date(customer.lastActivity).toLocaleDateString("pt-PT")}
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-muted-foreground">
                      Nenhum cliente encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminShell>
  );
}
