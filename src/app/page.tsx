import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { ModeloCard } from "@/components/modelo-card";
import { MarcaCard } from "@/components/marca-card";

export default async function Home() {
  const [ultimosModelos, marcasDestacadas] = await Promise.all([
    db.modelo.findMany({
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { marca: true },
    }),
    db.marca.findMany({ orderBy: { nombre: "asc" }, take: 4 }),
  ]);

  return (
    <div className="flex flex-1 flex-col">
      <section className="border-b bg-muted/30">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            La enciclopedia web de autos
          </h1>
          <p className="max-w-xl text-muted-foreground">
            Explora marcas y modelos de todo el mundo: historia, ficha técnica y fotos, todo en
            un solo lugar.
          </p>
          <div className="flex gap-3">
            <Button render={<Link href="/modelos" />} nativeButton={false}>
              Ver modelos
            </Button>
            <Button variant="outline" render={<Link href="/marcas" />} nativeButton={false}>
              Explorar marcas
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-medium">Últimos modelos agregados</h2>
          <Link
            href="/modelos"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Ver todos <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>
        {ultimosModelos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Todavía no hay modelos cargados.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {ultimosModelos.map((modelo) => (
              <ModeloCard key={modelo.id} modelo={modelo} priority />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-medium">Marcas destacadas</h2>
          <Link
            href="/marcas"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            Ver todas <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {marcasDestacadas.map((marca) => (
            <MarcaCard key={marca.id} marca={marca} />
          ))}
        </div>
      </section>
    </div>
  );
}
