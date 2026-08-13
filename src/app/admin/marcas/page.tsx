import Image from "next/image";
import Link from "next/link";
import { PencilIcon, PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { eliminarMarca } from "@/actions/marcas";

export const metadata = { title: "Administrar marcas" };

export default async function AdminMarcasPage() {
  const marcas = await db.marca.findMany({
    orderBy: { nombre: "asc" },
    include: { _count: { select: { modelos: true } } },
  });

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Administrar marcas</h1>
        <Button size="sm" render={<Link href="/admin/marcas/nueva" />}>
          <PlusIcon /> Nueva marca
        </Button>
      </div>

      <div className="divide-y rounded-lg border">
        {marcas.map((marca) => (
          <div key={marca.id} className="flex items-center gap-4 px-4 py-3">
            <div className="relative size-10 shrink-0">
              <Image src={marca.logoUrl} alt="" fill className="object-contain" sizes="40px" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{marca.nombre}</p>
              <p className="text-xs text-muted-foreground">
                {marca._count.modelos} modelo{marca._count.modelos === 1 ? "" : "s"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              render={<Link href={`/admin/marcas/${marca.id}/editar`} />}
            >
              <PencilIcon className="size-4" />
            </Button>
            <DeleteButton
              action={eliminarMarca.bind(null, marca.id)}
              confirmMessage={`¿Borrar la marca "${marca.nombre}"? Esta acción no se puede deshacer.`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
