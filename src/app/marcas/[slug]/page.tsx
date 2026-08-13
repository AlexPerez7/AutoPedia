import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PencilIcon } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ModeloCard } from "@/components/modelo-card";
import { FavoriteButton } from "@/components/favorite-button";

async function getMarca(slug: string) {
  return db.marca.findUnique({
    where: { slug },
    include: { modelos: { orderBy: { nombre: "asc" }, include: { marca: true } } },
  });
}

export async function generateMetadata({
  params,
}: PageProps<"/marcas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const marca = await getMarca(slug);
  if (!marca) return {};
  return { title: marca.nombre, description: marca.descripcion.slice(0, 160) };
}

export default async function MarcaDetallePage({ params }: PageProps<"/marcas/[slug]">) {
  const { slug } = await params;
  const [marca, session] = await Promise.all([getMarca(slug), auth()]);

  if (!marca) notFound();

  const isFavorito = session?.user.id
    ? Boolean(
        await db.favoriteMarca.findUnique({
          where: { userId_marcaId: { userId: session.user.id, marcaId: marca.id } },
        }),
      )
    : false;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative h-32 w-full shrink-0 sm:w-48">
          <Image
            src={marca.logoUrl}
            alt={`Logo de ${marca.nombre}`}
            fill
            className="object-contain"
            sizes="200px"
            priority
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-semibold">{marca.nombre}</h1>
            <div className="flex items-center gap-2">
              <FavoriteButton
                tipo="marca"
                id={marca.id}
                isFavorito={isFavorito}
                isAuthenticated={Boolean(session?.user)}
              />
              {session?.user.role === "ADMIN" && (
                <Button
                  variant="outline"
                  size="sm"
                  render={<Link href={`/admin/marcas/${marca.id}/editar`} />}
                  nativeButton={false}
                >
                  <PencilIcon /> Editar
                </Button>
              )}
            </div>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">País de origen</dt>
              <dd>{marca.paisOrigen}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Año de fundación</dt>
              <dd>{marca.anioFundacion}</dd>
            </div>
            {marca.fundador && (
              <div>
                <dt className="text-muted-foreground">Fundador</dt>
                <dd>{marca.fundador}</dd>
              </div>
            )}
          </dl>

          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed">{marca.descripcion}</p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-medium">
          Modelos de {marca.nombre} ({marca.modelos.length})
        </h2>
        {marca.modelos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Todavía no hay modelos cargados para esta marca.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {marca.modelos.map((modelo) => (
              <ModeloCard key={modelo.id} modelo={modelo} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
