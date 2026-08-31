import type { MetadataRoute } from "next";
import { SEO_COUNTRY_ISOS } from "@/lib/country-seo";

const baseUrl = "https://lusotop.online";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = ["", "/entrar", "/criar-conta", "/privacidade", "/termos", "/cookies"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : 0.4,
    })
  );

  const countryRoutes = SEO_COUNTRY_ISOS.map((iso) => ({
    url: `${baseUrl}/paises/${iso.toLowerCase()}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...countryRoutes];
}
