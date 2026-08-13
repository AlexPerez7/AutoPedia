import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarcaForm } from "@/components/admin/marca-form";
import { actualizarMarca } from "@/actions/marcas";
import { db } from "@/lib/db";

export const metadata = { title: "Editar marca" };

export default async function EditarMarcaPage({ params }: PageProps<"/admin/marcas/[id]/editar">) {
  const { id } = await params;
  const marca = await db.marca.findUnique({ where: { id } });
  if (!marca) notFound();

  return (
    <div className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Editar {marca.nombre}</CardTitle>
        </CardHeader>
        <CardContent>
          <MarcaForm
            action={actualizarMarca.bind(null, marca.id)}
            defaultValues={marca}
            submitLabel="Guardar cambios"
          />
        </CardContent>
      </Card>
    </div>
  );
}
