import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { MarcaCard } from "@/components/marca-card";
import { ModeloCard } from "@/components/modelo-card";

export const metadata = { title: "Favoritos" };

export default async function FavoritosPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [marcasFavoritas, modelosFavoritos] = await Promise.all([
    db.favoriteMarca.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { marca: true },
    }),
    db.favoriteModelo.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { modelo: { include: { marca: true } } },
    }),
  ]);

  const sinFavoritos = marcasFavoritas.length === 0 && modelosFavoritos.length === 0;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <h1 className="text-2xl font-semibold">Tus favoritos</h1>

      {sinFavoritos && (
        <p className="mt-2 text-muted-foreground">
          Todavía no marcaste ninguna marca o modelo como favorito.
        </p>
      )}

      {marcasFavoritas.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-medium">Marcas ({marcasFavoritas.length})</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {marcasFavoritas.map((fav) => (
              <MarcaCard key={fav.marcaId} marca={fav.marca} />
            ))}
          </div>
        </section>
      )}

      {modelosFavoritos.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-medium">Modelos ({modelosFavoritos.length})</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {modelosFavoritos.map((fav) => (
              <ModeloCard key={fav.modeloId} modelo={fav.modelo} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
