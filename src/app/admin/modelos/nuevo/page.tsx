import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeloForm } from "@/components/admin/modelo-form";
import { crearModelo } from "@/actions/modelos";
import { db } from "@/lib/db";

export const metadata = { title: "Nuevo modelo" };

export default async function NuevoModeloPage() {
  const marcas = await db.marca.findMany({ orderBy: { nombre: "asc" }, select: { id: true, nombre: true } });

  return (
    <div className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Nuevo modelo</CardTitle>
        </CardHeader>
        <CardContent>
          <ModeloForm action={crearModelo} marcas={marcas} submitLabel="Crear modelo" />
        </CardContent>
      </Card>
    </div>
  );
}
