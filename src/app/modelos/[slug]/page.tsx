import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PencilIcon } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/favorite-button";
import { TIPO_COMBUSTIBLE_LABELS, type TipoCombustible } from "@/lib/validations";

async function getModelo(slug: string) {
  return db.modelo.findUnique({ where: { slug }, include: { marca: true } });
}

export async function generateMetadata({
  params,
}: PageProps<"/modelos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const modelo = await getModelo(slug);
  if (!modelo) return {};
  return {
    title: `${modelo.marca.nombre} ${modelo.nombre}`,
    description: modelo.descripcion.slice(0, 160),
  };
}

const FICHA_TECNICA: {
  label: string;
  value: (modelo: NonNullable<Awaited<ReturnType<typeof getModelo>>>) => string | null;
}[] = [
  { label: "Marca", value: (m) => m.marca.nombre },
  { label: "Generación", value: (m) => m.generacion },
  {
    label: "Años",
    value: (m) =>
      m.anioInicio && m.anioFin
        ? `${m.anioInicio} – ${m.anioFin}`
        : m.anioInicio
          ? `Desde ${m.anioInicio}`
          : null,
  },
  { label: "Configuración de motor", value: (m) => m.configuracionMotor },
  { label: "Cilindrada", value: (m) => (m.cilindradaMotorLitros ? `${m.cilindradaMotorLitros}L` : null) },
  { label: "Potencia", value: (m) => (m.caballosFuerza ? `${m.caballosFuerza} HP` : null) },
  { label: "Torque", value: (m) => (m.torque ? `${m.torque} Nm` : null) },
];

export default async function ModeloDetallePage({ params }: PageProps<"/modelos/[slug]">) {
  const { slug } = await params;
  const [modelo, session] = await Promise.all([getModelo(slug), auth()]);

  if (!modelo) notFound();

  const isFavorito = session?.user.id
    ? Boolean(
        await db.favoriteModelo.findUnique({
          where: { userId_modeloId: { userId: session.user.id, modeloId: modelo.id } },
        }),
      )
    : false;

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
        <Image
          src={modelo.imagenUrl}
          alt={modelo.nombre}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 800px, 100vw"
          priority
        />
      </div>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href={`/marcas/${modelo.marca.slug}`} className="text-sm text-muted-foreground hover:underline">
            {modelo.marca.nombre}
          </Link>
          <h1 className="text-2xl font-semibold">{modelo.nombre}</h1>
          <Badge variant="secondary" className="mt-1">
            {TIPO_COMBUSTIBLE_LABELS[modelo.tipoCombustible as TipoCombustible] ?? modelo.tipoCombustible}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton
            tipo="modelo"
            id={modelo.id}
            isFavorito={isFavorito}
            isAuthenticated={Boolean(session?.user)}
          />
          {session?.user.role === "ADMIN" && (
            <Button
              variant="outline"
              size="sm"
              render={<Link href={`/admin/modelos/${modelo.id}/editar`} />}
              nativeButton={false}
            >
              <PencilIcon /> Editar
            </Button>
          )}
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 rounded-lg border p-4 text-sm sm:grid-cols-3">
        {FICHA_TECNICA.map(({ label, value }) => {
          const v = value(modelo);
          if (!v) return null;
          return (
            <div key={label}>
              <dt className="text-muted-foreground">{label}</dt>
              <dd>{v}</dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-6 whitespace-pre-line text-sm leading-relaxed">{modelo.descripcion}</p>
    </div>
  );
}
