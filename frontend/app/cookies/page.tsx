import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Política de Cookies | LusoTop",
  robots: { index: false, follow: true },
};

export default function CookiesPage() {
  return (
    <LegalPage title="Política de Cookies">
      <p>
        A LusoTop, no seu estado atual, não utiliza cookies de rastreio ou
        publicidade. O único armazenamento local usado é o{" "}
        <code>localStorage</code> do teu browser, para guardar a sessão de
        autenticação (token) depois de entrares na tua conta.
      </p>
      <p>
        Uma política de cookies detalhada será publicada caso sejam
        introduzidas ferramentas de análise ou publicidade no futuro.
      </p>
    </LegalPage>
  );
}
