"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { marcaSchema } from "@/lib/validations";
import { guardarImagenSubida, borrarImagenSubida } from "@/lib/storage";
import type { ActionState } from "@/actions/auth";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("No autorizado");
  }
  return session;
}

async function uniqueSlug(nombre: string, ignoreId?: string): Promise<string> {
  const base = slugify(nombre);
  let slug = base;
  let suffix = 2;
  while (true) {
    const existente = await db.marca.findUnique({ where: { slug } });
    if (!existente || existente.id === ignoreId) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

export async function crearMarca(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = marcaSchema.safeParse({
    nombre: formData.get("nombre"),
    anioFundacion: formData.get("anioFundacion"),
    paisOrigen: formData.get("paisOrigen"),
    descripcion: formData.get("descripcion"),
    fundador: formData.get("fundador"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
    return { fieldErrors };
  }

  const logoFile = formData.get("logo") as File | null;
  if (!logoFile || logoFile.size === 0) {
    return { fieldErrors: { logo: "El logo es obligatorio" } };
  }

  let logoUrl: string;
  try {
    logoUrl = await guardarImagenSubida(logoFile);
  } catch (error) {
    return { fieldErrors: { logo: (error as Error).message } };
  }

  const slug = await uniqueSlug(parsed.data.nombre);

  await db.marca.create({
    data: { ...parsed.data, slug, logoUrl },
  });

  revalidatePath("/marcas");
  redirect("/admin/marcas");
}

export async function actualizarMarca(
  marcaId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const marcaExistente = await db.marca.findUnique({ where: { id: marcaId } });
  if (!marcaExistente) return { error: "Marca no encontrada" };

  const parsed = marcaSchema.safeParse({
    nombre: formData.get("nombre"),
    anioFundacion: formData.get("anioFundacion"),
    paisOrigen: formData.get("paisOrigen"),
    descripcion: formData.get("descripcion"),
    fundador: formData.get("fundador"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
    return { fieldErrors };
  }

  const logoFile = formData.get("logo") as File | null;
  let logoUrl = marcaExistente.logoUrl;
  if (logoFile && logoFile.size > 0) {
    try {
      logoUrl = await guardarImagenSubida(logoFile);
    } catch (error) {
      return { fieldErrors: { logo: (error as Error).message } };
    }
    await borrarImagenSubida(marcaExistente.logoUrl);
  }

  const slug =
    parsed.data.nombre === marcaExistente.nombre
      ? marcaExistente.slug
      : await uniqueSlug(parsed.data.nombre, marcaId);

  await db.marca.update({
    where: { id: marcaId },
    data: { ...parsed.data, slug, logoUrl },
  });

  revalidatePath("/marcas");
  revalidatePath(`/marcas/${slug}`);
  redirect("/admin/marcas");
}

export async function eliminarMarca(marcaId: string) {
  await requireAdmin();

  const marca = await db.marca.findUnique({ where: { id: marcaId } });
  if (!marca) return;

  const tieneModelos = await db.modelo.count({ where: { marcaId } });
  if (tieneModelos > 0) {
    throw new Error("No se puede borrar una marca que todavía tiene modelos cargados.");
  }

  await db.marca.delete({ where: { id: marcaId } });
  await borrarImagenSubida(marca.logoUrl);

  revalidatePath("/marcas");
  revalidatePath("/admin/marcas");
}
