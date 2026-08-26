import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Privacidade: LusoTop" };

export default function PrivacidadePage() {
  return (
    <LegalPage title="Política de Privacidade">
      <p>
        Esta página explica que dados a LusoTop recolhe e como são
        utilizados.
      </p>

      <h2 className="mt-8 font-heading text-xl font-semibold text-foreground">
        1. Que dados recolhemos
      </h2>
      <p className="mt-3 leading-relaxed">
        Ao criares conta, guardamos o teu nome, email e password (protegida
        com hash BCrypt, nunca em texto simples). A LusoTop está em
        pré-lançamento: enquanto a ligação a fornecedores de pagamento e de
        airtime não estiver ativa, não recolhemos nem processamos nenhum
        dado de pagamento.
      </p>

      <h2 className="mt-8 font-heading text-xl font-semibold text-foreground">
        2. Como guardamos os dados
      </h2>
      <p className="mt-3 leading-relaxed">
        Os dados de conta são guardados numa base de dados PostgreSQL
        gerida (Neon). A sessão iniciada é mantida através de um token JWT
        guardado no armazenamento local do teu browser.
      </p>

      <h2 className="mt-8 font-heading text-xl font-semibold text-foreground">
        3. Os teus direitos
      </h2>
      <p className="mt-3 leading-relaxed">
        Podes pedir acesso, correção ou eliminação dos teus dados pessoais a
        qualquer momento, incluindo ao abrigo do RGPD se estiveres na União
        Europeia. Assim que os pagamentos reais entrarem em produção,
        publicamos aqui a política completa sobre dados financeiros.
      </p>

      <h2 className="mt-8 font-heading text-xl font-semibold text-foreground">
        4. Contacto
      </h2>
      <p className="mt-3 leading-relaxed">
        Para questões sobre os teus dados, contacta-nos através dos canais
        indicados na secção de Ajuda.
      </p>
    </LegalPage>
  );
}
