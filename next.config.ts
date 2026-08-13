import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Solo servimos SVGs generados por nuestro propio script de seed (placeholders),
    // nunca SVGs subidos por usuarios (el form de admin restringe a jpg/png/webp).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
