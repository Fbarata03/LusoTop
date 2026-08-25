import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Termos de Serviço — LusoTop" };

export default function TermosPage() {
  return (
    <LegalPage title="Termos de Serviço">
      <p>
        Esta página está em preparação. A LusoTop está atualmente em{" "}
        <strong>modo DEMO</strong>: o fluxo de recarga é uma simulação
        completa, mas nenhum pagamento é processado e nenhuma recarga real é
        enviada.
      </p>
      <p>
        Os termos de serviço completos serão publicados antes do lançamento
        em produção, cobrindo condições de utilização, política de
        reembolso, e as responsabilidades de cada fornecedor de pagamento e
        airtime integrado.
      </p>
      <p>
        A conta que crias hoje (registo/login) é real — passwords com hash
        seguro e autenticação por JWT — mas ainda não está associada a
        nenhuma transação financeira real.
      </p>
    </LegalPage>
  );
}
