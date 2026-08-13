import path from "node:path";
import fs from "node:fs/promises";
import { randomUUID } from "node:crypto";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");
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
    throw new Error("Formato de imagen no soportado. Usá JPG, PNG o WEBP.");
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("La imagen no puede superar los 5MB.");
  }

  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  const fileName = `${randomUUID()}${EXT_BY_TYPE[file.type]}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, fileName), buffer);

  return `/uploads/${fileName}`;
}

export async function borrarImagenSubida(url: string): Promise<void> {
  if (!url.startsWith("/uploads/")) return;
  const filePath = path.join(process.cwd(), "public", url);
  await fs.rm(filePath, { force: true });
}
