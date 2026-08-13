"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { modeloSchema } from "@/lib/validations";
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
    const existente = await db.modelo.findUnique({ where: { slug } });
    if (!existente || existente.id === ignoreId) return slug;
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
}

function parseModeloForm(formData: FormData) {
  return modeloSchema.safeParse({
    nombre: formData.get("nombre"),
    marcaId: formData.get("marcaId"),
    generacion: formData.get("generacion"),
    anioInicio: formData.get("anioInicio"),
    anioFin: formData.get("anioFin"),
    descripcion: formData.get("descripcion"),
    cilindradaMotorLitros: formData.get("cilindradaMotorLitros"),
    caballosFuerza: formData.get("caballosFuerza"),
    torque: formData.get("torque"),
    configuracionMotor: formData.get("configuracionMotor"),
    tipoCombustible: formData.get("tipoCombustible"),
  });
}

export async function crearModelo(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const parsed = parseModeloForm(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
    return { fieldErrors };
  }

  const imagenFile = formData.get("imagen") as File | null;
  if (!imagenFile || imagenFile.size === 0) {
    return { fieldErrors: { imagen: "La imagen es obligatoria" } };
  }

  let imagenUrl: string;
  try {
    imagenUrl = await guardarImagenSubida(imagenFile);
  } catch (error) {
    return { fieldErrors: { imagen: (error as Error).message } };
  }

  const slug = await uniqueSlug(parsed.data.nombre);

  await db.modelo.create({
    data: { ...parsed.data, slug, imagenUrl },
  });

  revalidatePath("/modelos");
  redirect("/admin/modelos");
}

export async function actualizarModelo(
  modeloId: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();

  const modeloExistente = await db.modelo.findUnique({ where: { id: modeloId } });
  if (!modeloExistente) return { error: "Modelo no encontrado" };

  const parsed = parseModeloForm(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path[0] as string] = issue.message;
    return { fieldErrors };
  }

  const imagenFile = formData.get("imagen") as File | null;
  let imagenUrl = modeloExistente.imagenUrl;
  if (imagenFile && imagenFile.size > 0) {
    try {
      imagenUrl = await guardarImagenSubida(imagenFile);
    } catch (error) {
      return { fieldErrors: { imagen: (error as Error).message } };
    }
    await borrarImagenSubida(modeloExistente.imagenUrl);
  }

  const slug =
    parsed.data.nombre === modeloExistente.nombre
      ? modeloExistente.slug
      : await uniqueSlug(parsed.data.nombre, modeloId);

  await db.modelo.update({
    where: { id: modeloId },
    data: { ...parsed.data, slug, imagenUrl },
  });

  revalidatePath("/modelos");
  revalidatePath(`/modelos/${slug}`);
  redirect("/admin/modelos");
}

export async function eliminarModelo(modeloId: string) {
  await requireAdmin();

  const modelo = await db.modelo.findUnique({ where: { id: modeloId } });
  if (!modelo) return;

  await db.modelo.delete({ where: { id: modeloId } });
  await borrarImagenSubida(modelo.imagenUrl);

  revalidatePath("/modelos");
  revalidatePath("/admin/modelos");
}
