import { db } from "@/lib/db";
import { MarcaCard } from "@/components/marca-card";
import { ModeloCard } from "@/components/modelo-card";

export const metadata = { title: "Buscar" };

export default async function BuscarPage({ searchParams }: PageProps<"/buscar">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim() : "";

  const [marcas, modelos] = q
    ? await Promise.all([
        db.marca.findMany({
          where: { nombre: { contains: q } },
          orderBy: { nombre: "asc" },
        }),
        db.modelo.findMany({
          where: { nombre: { contains: q } },
          orderBy: { nombre: "asc" },
          include: { marca: true },
        }),
      ])
    : [[], []];

  const sinResultados = q && marcas.length === 0 && modelos.length === 0;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold">
        {q ? (
          <>
            Resultados para <span className="text-muted-foreground">&quot;{q}&quot;</span>
          </>
        ) : (
          "Buscar"
        )}
      </h1>

      {!q && <p className="mt-2 text-muted-foreground">Escribí un término en la barra de búsqueda.</p>}
      {sinResultados && <p className="mt-2 text-muted-foreground">No se encontraron resultados.</p>}

      {marcas.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-medium">Marcas ({marcas.length})</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {marcas.map((marca) => (
              <MarcaCard key={marca.id} marca={marca} />
            ))}
          </div>
        </section>
      )}

      {modelos.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-medium">Modelos ({modelos.length})</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {modelos.map((modelo) => (
              <ModeloCard key={modelo.id} modelo={modelo} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
