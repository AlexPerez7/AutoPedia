"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user.id) throw new Error("Necesitás iniciar sesión");
  return session.user.id;
}

export async function toggleFavoritoMarca(marcaId: string, path: string) {
  const userId = await requireUserId();

  const existente = await db.favoriteMarca.findUnique({
    where: { userId_marcaId: { userId, marcaId } },
  });

  if (existente) {
    await db.favoriteMarca.delete({ where: { userId_marcaId: { userId, marcaId } } });
  } else {
    await db.favoriteMarca.create({ data: { userId, marcaId } });
  }

  revalidatePath(path);
  revalidatePath("/favoritos");
}

export async function toggleFavoritoModelo(modeloId: string, path: string) {
  const userId = await requireUserId();

  const existente = await db.favoriteModelo.findUnique({
    where: { userId_modeloId: { userId, modeloId } },
  });

  if (existente) {
    await db.favoriteModelo.delete({ where: { userId_modeloId: { userId, modeloId } } });
  } else {
    await db.favoriteModelo.create({ data: { userId, modeloId } });
  }

  revalidatePath(path);
  revalidatePath("/favoritos");
}
