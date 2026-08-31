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
  title: {
    default:
      "LusoTop — Recarga de saldo online para Angola, Brasil, Portugal e CPLP",
    template: "%s | LusoTop",
  },
  description:
    "Recarregue saldo de telemóvel online para Angola, Brasil, Cabo Verde, Guiné-Bissau, Moçambique, Portugal e São Tomé e Príncipe. Entrega imediata, pagamento seguro em euros, comprovativo por email.",
  keywords: [
    "recarga de saldo",
    "recarregar saldo online",
    "carregar telemóvel",
    "recarga Angola",
    "recarga Brasil",
    "recarga Portugal",
    "recarga Moçambique",
    "recarga Cabo Verde",
    "recarga Unitel",
    "recarga Movicel",
    "recarga MEO",
    "recarga Vodacom",
    "top-up CPLP",
  ],
  alternates: {
    canonical: "/",
  },
  verification: {
    google: "WTsTt58-RwTSRIryDtQvWN_POEOUI5WQkTmmZiU2E94",
  },
  openGraph: {
    title:
      "LusoTop — Recarga de saldo online para Angola, Brasil, Portugal e CPLP",
    description:
      "Recarregue saldo de telemóvel online para todos os países da CPLP. Entrega imediata, pagamento seguro em euros.",
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
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  name: "LusoTop",
                  url: "https://lusotop.online",
                  logo: "https://lusotop.online/icon.png",
                  description:
                    "Recargas de saldo móvel online para os países de língua portuguesa (CPLP).",
                },
                {
                  "@type": "WebSite",
                  name: "LusoTop",
                  url: "https://lusotop.online",
                  inLanguage: "pt-PT",
                },
              ],
            }),
          }}
        />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
