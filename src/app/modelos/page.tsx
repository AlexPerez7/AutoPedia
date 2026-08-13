import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { ModeloCard } from "@/components/modelo-card";
import { ModelosFilters } from "@/components/modelos-filters";
import { TIPOS_COMBUSTIBLE, type TipoCombustible } from "@/lib/validations";

export const metadata = { title: "Modelos" };

export default async function ModelosPage({ searchParams }: PageProps<"/modelos">) {
  const params = await searchParams;
  const marcaSlug = typeof params.marca === "string" ? params.marca : undefined;
  const tipoCombustibleParam = typeof params.tipoCombustible === "string" ? params.tipoCombustible : undefined;
  const tipoCombustible = TIPOS_COMBUSTIBLE.includes(tipoCombustibleParam as TipoCombustible)
    ? (tipoCombustibleParam as TipoCombustible)
    : undefined;

  const [modelos, marcas, session] = await Promise.all([
    db.modelo.findMany({
      where: {
        marca: marcaSlug ? { slug: marcaSlug } : undefined,
        tipoCombustible,
      },
      orderBy: { nombre: "asc" },
      include: { marca: true },
    }),
    db.marca.findMany({ orderBy: { nombre: "asc" }, select: { slug: true, nombre: true } }),
    auth(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Modelos</h1>
          <p className="text-sm text-muted-foreground">
            {modelos.length} modelo{modelos.length === 1 ? "" : "s"}
          </p>
        </div>
        {session?.user.role === "ADMIN" && (
          <Button size="sm" render={<Link href="/admin/modelos/nuevo" />} nativeButton={false}>
            <PlusIcon /> Nuevo modelo
          </Button>
        )}
      </div>

      <div className="mb-6">
        <ModelosFilters marcas={marcas} marcaActual={marcaSlug} tipoCombustibleActual={tipoCombustible} />
      </div>

      {modelos.length === 0 ? (
        <p className="text-muted-foreground">No se encontraron modelos con esos filtros.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {modelos.map((modelo, index) => (
            <ModeloCard key={modelo.id} modelo={modelo} priority={index < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
