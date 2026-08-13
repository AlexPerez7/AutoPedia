import Image from "next/image";
import Link from "next/link";
import { PencilIcon, PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/admin/delete-button";
import { eliminarModelo } from "@/actions/modelos";

export const metadata = { title: "Administrar modelos" };

export default async function AdminModelosPage() {
  const modelos = await db.modelo.findMany({
    orderBy: { nombre: "asc" },
    include: { marca: true },
  });

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Administrar modelos</h1>
        <Button size="sm" render={<Link href="/admin/modelos/nuevo" />} nativeButton={false}>
          <PlusIcon /> Nuevo modelo
        </Button>
      </div>

      <div className="divide-y rounded-lg border">
        {modelos.map((modelo) => (
          <div key={modelo.id} className="flex items-center gap-4 px-4 py-3">
            <div className="relative h-10 w-14 shrink-0 overflow-hidden rounded">
              <Image src={modelo.imagenUrl} alt="" fill className="object-cover" sizes="56px" />
            </div>
            <div className="flex-1">
              <p className="font-medium">{modelo.nombre}</p>
              <p className="text-xs text-muted-foreground">{modelo.marca.nombre}</p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              render={<Link href={`/admin/modelos/${modelo.id}/editar`} />}
              nativeButton={false}
            >
              <PencilIcon className="size-4" />
            </Button>
            <DeleteButton
              action={eliminarModelo.bind(null, modelo.id)}
              confirmMessage={`¿Borrar el modelo "${modelo.nombre}"? Esta acción no se puede deshacer.`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
