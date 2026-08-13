import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarcaForm } from "@/components/admin/marca-form";
import { crearMarca } from "@/actions/marcas";

export const metadata = { title: "Nueva marca" };

export default function NuevaMarcaPage() {
  return (
    <div className="mx-auto w-full max-w-xl flex-1 px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Nueva marca</CardTitle>
        </CardHeader>
        <CardContent>
          <MarcaForm action={crearMarca} submitLabel="Crear marca" />
        </CardContent>
      </Card>
    </div>
  );
}
