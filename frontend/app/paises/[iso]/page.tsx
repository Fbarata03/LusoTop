import { CountryPageContent } from "./CountryPageContent";

const ACTIVE_COUNTRY_ISOS = ["AO", "BR", "CV", "GW", "MZ", "PT", "ST"];

export function generateStaticParams() {
  return ACTIVE_COUNTRY_ISOS.map((iso) => ({ iso: iso.toLowerCase() }));
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ iso: string }>;
}) {
  const { iso } = await params;
  return <CountryPageContent iso={iso.toUpperCase()} />;
}
