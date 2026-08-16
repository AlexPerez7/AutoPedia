import { randomUUID } from "node:crypto";
import { del, put } from "@vercel/blob";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

/**
 * Solo acepta jpg/png/webp (nunca svg) para que las imágenes subidas por
 * usuarios no puedan aprovechar next.config's dangerouslyAllowSVG.
 */
export async function guardarImagenSubida(file: File): Promise<string> {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Formato de imagen no soportado. Usa JPG, PNG o WEBP.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("La imagen no puede superar los 5MB.");
  }

  const fileName = `${randomUUID()}${EXT_BY_TYPE[file.type]}`;
  const blob = await put(`uploads/${fileName}`, file, {
    access: "public",
    contentType: file.type,
  });

  return blob.url;
}

export async function borrarImagenSubida(url: string): Promise<void> {
  if (!url.includes("/uploads/")) return;
  await del(url);
}
