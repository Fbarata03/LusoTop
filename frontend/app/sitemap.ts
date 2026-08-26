import type { MetadataRoute } from "next";

const baseUrl = "https://lusotop.online";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/entrar", "/criar-conta", "/privacidade", "/termos", "/cookies"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));
}
