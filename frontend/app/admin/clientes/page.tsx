"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ApiError, fetchAdminCustomers } from "@/lib/api";
import type { AdminCustomer } from "@/lib/api";

export default function AdminClientesPage() {
  const [customers, setCustomers] = useState<AdminCustomer[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdminCustomers()
      .then(setCustomers)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Não foi possível carregar."));
  }, []);

  return (
    <AdminShell>
      <h1 className="font-heading text-2xl font-semibold text-foreground">Clientes</h1>

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
        <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-background">
          <table className="w-full min-w-[720px] text-left text-sm">
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
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-border last:border-0">
                  <td className="p-3 font-medium text-foreground">{customer.name}</td>
                  <td className="p-3 text-muted-foreground">{customer.email}</td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(customer.createdAt).toLocaleDateString("pt-PT")}
                  </td>
                  <td className="p-3 text-foreground">{customer.orderCount}</td>
                  <td className="p-3 text-foreground">
                    {customer.totalSpentEur.toLocaleString("pt-PT", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {new Date(customer.lastActivity).toLocaleDateString("pt-PT")}
                  </td>
                </tr>
              ))}

              {customers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">
                    Ainda não há clientes registados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
