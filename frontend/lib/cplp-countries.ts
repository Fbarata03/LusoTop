/**
 * Referência estática dos 7 países da CPLP com operadora real na LusoTop, usada apenas
 * para exibição (ex. footer) sem depender de uma chamada à API. A fonte de verdade para
 * status (ACTIVE/COMING_SOON/DISABLED) é sempre a API — ver components/home/CountriesGrid.
 */
export const CPLP_COUNTRIES = [
  { name: "Angola", isoCode: "AO", phoneCode: "+244" },
  { name: "Portugal", isoCode: "PT", phoneCode: "+351" },
  { name: "Brasil", isoCode: "BR", phoneCode: "+55" },
  { name: "Cabo Verde", isoCode: "CV", phoneCode: "+238" },
  { name: "Guiné-Bissau", isoCode: "GW", phoneCode: "+245" },
  { name: "Moçambique", isoCode: "MZ", phoneCode: "+258" },
  { name: "São Tomé e Príncipe", isoCode: "ST", phoneCode: "+239" },
] as const;
