import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [marcas, modelos] = await Promise.all([
    db.marca.findMany({ select: { slug: true } }),
    db.modelo.findMany({ select: { slug: true } }),
  ]);

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/marcas`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/modelos`, changeFrequency: "weekly", priority: 0.8 },
    ...marcas.map((marca) => ({
      url: `${SITE_URL}/marcas/${marca.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...modelos.map((modelo) => ({
      url: `${SITE_URL}/modelos/${modelo.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
