import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = { title: "Termos de Serviço: LusoTop" };

export default function TermosPage() {
  return (
    <LegalPage title="Termos de Serviço">
      <p>
        Ao usares a LusoTop, aceitas estes termos. Se não concordares, por
        favor não utilizes a plataforma.
      </p>

      <h2 className="mt-8 font-heading text-xl font-semibold text-foreground">
        1. O serviço
      </h2>
      <p className="mt-3 leading-relaxed">
        A LusoTop é uma plataforma para enviar recargas móveis para 7 países
        da CPLP: Angola, Brasil, Cabo Verde, Guiné-Bissau, Moçambique,
        Portugal, e São Tomé e Príncipe.
      </p>

      <h2 className="mt-8 font-heading text-xl font-semibold text-foreground">
        2. Pagamentos e recargas
      </h2>
      <p className="mt-3 leading-relaxed">
        Os pagamentos são processados pela Stripe e cobrados de imediato. A
        recarga é enviada logo após a confirmação do pagamento. Se, por
        algum motivo, a recarga não puder ser entregue depois de o
        pagamento ser confirmado, o valor pago é reembolsado
        automaticamente através da Stripe.
      </p>

      <h2 className="mt-8 font-heading text-xl font-semibold text-foreground">
        3. Conta de utilizador
      </h2>
      <p className="mt-3 leading-relaxed">
        És responsável por manteres a tua password em segurança e por todas
        as ações realizadas com a tua conta. Podes pedir o encerramento da
        tua conta a qualquer momento contactando-nos.
      </p>

      <h2 className="mt-8 font-heading text-xl font-semibold text-foreground">
        4. Alterações a estes termos
      </h2>
      <p className="mt-3 leading-relaxed">
        Podemos atualizar estes termos à medida que a plataforma evolui, e
        vamos assinalar aqui qualquer alteração relevante.
      </p>

      <h2 className="mt-8 font-heading text-xl font-semibold text-foreground">
        5. Contacto
      </h2>
      <p className="mt-3 leading-relaxed">
        Para questões sobre estes termos, usa os canais indicados na secção
        de Ajuda.
      </p>
    </LegalPage>
  );
}
