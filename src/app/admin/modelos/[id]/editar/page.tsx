import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeloForm } from "@/components/admin/modelo-form";
import { actualizarModelo } from "@/actions/modelos";
import { db } from "@/lib/db";

export const metadata = { title: "Editar modelo" };

export default async function EditarModeloPage({ params }: PageProps<"/admin/modelos/[id]/editar">) {
  const { id } = await params;
  const [modelo, marcas] = await Promise.all([
    db.modelo.findUnique({ where: { id } }),
    db.marca.findMany({ orderBy: { nombre: "asc" }, select: { id: true, nombre: true } }),
  ]);
  if (!modelo) notFound();

  return (
    <div className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Editar {modelo.nombre}</CardTitle>
        </CardHeader>
        <CardContent>
          <ModeloForm
            action={actualizarModelo.bind(null, modelo.id)}
            marcas={marcas}
            defaultValues={modelo}
            submitLabel="Guardar cambios"
          />
        </CardContent>
      </Card>
    </div>
  );
}
