import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Privacidade — LusoTop" };

export default function PrivacidadePage() {
  return (
    <LegalPage title="Política de Privacidade">
      <p>
        Esta página está em preparação. A LusoTop está ainda em modo DEMO e
        não processa pagamentos nem recargas reais — os únicos dados
        pessoais atualmente recolhidos são os de registo de conta (nome,
        email e password com hash).
      </p>
      <p>
        A política de privacidade completa, incluindo conformidade com o
        RGPD para utilizadores da União Europeia, será publicada antes do
        lançamento em produção com fornecedores de pagamento e airtime
        reais.
      </p>
      <p>
        Para questões sobre os teus dados, contacta-nos através dos canais
        indicados na secção de Ajuda.
      </p>
    </LegalPage>
  );
}
