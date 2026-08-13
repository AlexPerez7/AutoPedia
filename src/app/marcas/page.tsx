import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { MarcaCard } from "@/components/marca-card";

export const metadata = { title: "Marcas" };

export default async function MarcasPage() {
  const [marcas, session] = await Promise.all([
    db.marca.findMany({ orderBy: { nombre: "asc" } }),
    auth(),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Marcas</h1>
          <p className="text-sm text-muted-foreground">
            {marcas.length} marca{marcas.length === 1 ? "" : "s"} en el catálogo
          </p>
        </div>
        {session?.user.role === "ADMIN" && (
          <Button size="sm" render={<Link href="/admin/marcas/nueva" />} nativeButton={false}>
            <PlusIcon /> Nueva marca
          </Button>
        )}
      </div>

      {marcas.length === 0 ? (
        <p className="text-muted-foreground">Todavía no hay marcas cargadas.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {marcas.map((marca, index) => (
            <MarcaCard key={marca.id} marca={marca} priority={index < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
