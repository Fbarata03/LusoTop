/**
 * Dados estáticos por país usados para renderizar as páginas /paises/<iso> já no HTML
 * (SSG) — títulos, descrições e conteúdo indexável pelos motores de busca. A lista de
 * operadoras vem da base de dados (ver migração V13+) e é mantida em sincronia à mão;
 * a fonte de verdade para preços/produtos continua a ser a API.
 */
export interface CountrySeo {
  iso: string;
  name: string;
  /** Nome no genitivo/uso natural: "de Angola", "do Brasil" */
  ofName: string;
  phoneCode: string;
  currencyCode: string;
  currencyName: string;
  operators: string[];
  /** Frase de abertura, única por país, com as palavras que as pessoas pesquisam. */
  intro: string;
}

export const COUNTRY_SEO: Record<string, CountrySeo> = {
  AO: {
    iso: "AO",
    name: "Angola",
    ofName: "de Angola",
    phoneCode: "+244",
    currencyCode: "AOA",
    currencyName: "kwanza",
    operators: ["Unitel", "Movicel", "Africell"],
    intro:
      "Faça recargas de saldo para Angola online, em segundos, a partir de qualquer país. Carregue números Unitel, Movicel e Africell e o saldo chega na hora ao telemóvel em Angola.",
  },
  BR: {
    iso: "BR",
    name: "Brasil",
    ofName: "do Brasil",
    phoneCode: "+55",
    currencyCode: "BRL",
    currencyName: "real",
    operators: ["Claro", "Vivo", "TIM", "Algar Telecom", "Sercomtel"],
    intro:
      "Recarregue celular no Brasil online e pague em euros. Créditos para Claro, Vivo, TIM e outras operadoras entregues na hora, sem sair de casa.",
  },
  CV: {
    iso: "CV",
    name: "Cabo Verde",
    ofName: "de Cabo Verde",
    phoneCode: "+238",
    currencyCode: "CVE",
    currencyName: "escudo cabo-verdiano",
    operators: ["Unitel T+", "Alou (CVMóvel)"],
    intro:
      "Envie recargas de saldo para Cabo Verde online. Carregue números Unitel T+ e Alou (CVMóvel) e o saldo chega de imediato ao telemóvel na ilha.",
  },
  GW: {
    iso: "GW",
    name: "Guiné-Bissau",
    ofName: "da Guiné-Bissau",
    phoneCode: "+245",
    currencyCode: "XOF",
    currencyName: "franco CFA",
    operators: ["Orange Bissau", "MTN Guiné-Bissau"],
    intro:
      "Faça recargas de saldo para a Guiné-Bissau online, a partir de qualquer país. Carregue números Orange e MTN e o saldo chega na hora.",
  },
  MZ: {
    iso: "MZ",
    name: "Moçambique",
    ofName: "de Moçambique",
    phoneCode: "+258",
    currencyCode: "MZN",
    currencyName: "metical",
    operators: ["Vodacom", "Movitel", "mCel (Tmcel)"],
    intro:
      "Recarregue saldo para Moçambique online e pague em euros. Créditos para Vodacom, Movitel e mCel (Tmcel) entregues no momento ao telemóvel.",
  },
  PT: {
    iso: "PT",
    name: "Portugal",
    ofName: "de Portugal",
    phoneCode: "+351",
    currencyCode: "EUR",
    currencyName: "euro",
    operators: ["MEO", "NOS", "Vodafone", "Moche", "UZO", "Lycamobile"],
    intro:
      "Carregue o telemóvel em Portugal online, em segundos. Recargas para MEO, NOS, Vodafone, Moche, UZO e Lycamobile com saldo entregue na hora.",
  },
  ST: {
    iso: "ST",
    name: "São Tomé e Príncipe",
    ofName: "de São Tomé e Príncipe",
    phoneCode: "+239",
    currencyCode: "STN",
    currencyName: "dobra",
    operators: ["CST (Companhia Santomense de Telecomunicações)"],
    intro:
      "Envie recargas de saldo para São Tomé e Príncipe online. Carregue números CST e o saldo chega de imediato ao telemóvel.",
  },
};

export const SEO_COUNTRY_ISOS = Object.keys(COUNTRY_SEO);
