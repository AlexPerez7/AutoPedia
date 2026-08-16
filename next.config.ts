import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Coincide con el límite de 5MB que ya validan las subidas en src/lib/storage.ts.
      bodySizeLimit: "5mb",
    },
  },
  images: {
    // Solo servimos SVGs generados por nuestro propio script de seed (placeholders),
    // nunca SVGs subidos por usuarios (el form de admin restringe a jpg/png/webp).
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
