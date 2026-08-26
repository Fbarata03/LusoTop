// Deploy: GitHub Pages (frontend, static export, custom domain lusotop.online) + Render (backend) + Neon (database).
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
