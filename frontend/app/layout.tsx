import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "flag-icons/css/flag-icons.min.css";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lusotop.online"),
  title: "LusoTop — Recargas para a comunidade lusófona",
  description:
    "Recargas móveis rápidas e simples para os países da CPLP. Angola, Brasil, Cabo Verde, Guiné-Bissau, Guiné Equatorial, Moçambique, Portugal, São Tomé e Príncipe e Timor-Leste.",
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "WTsTt58-RwTSRIryDtQvWN_POEOUI5WQkTmmZiU2E94",
  },
  openGraph: {
    title: "LusoTop — Recargas para a comunidade lusófona",
    description:
      "Recargas móveis rápidas e simples para os países da CPLP. Todos os países da CPLP disponíveis.",
    url: "https://lusotop.online",
    siteName: "LusoTop",
    locale: "pt_PT",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt"
      className={`${inter.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
