import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TIPO_COMBUSTIBLE_LABELS, type TipoCombustible } from "@/lib/validations";

export function ModeloCard({
  modelo,
  priority = false,
}: {
  modelo: {
    slug: string;
    nombre: string;
    imagenUrl: string;
    anioInicio: number | null;
    anioFin: number | null;
    tipoCombustible: string;
    marca: { nombre: string };
  };
  priority?: boolean;
}) {
  const rango =
    modelo.anioInicio && modelo.anioFin
      ? `${modelo.anioInicio}–${modelo.anioFin}`
      : modelo.anioInicio
        ? `Desde ${modelo.anioInicio}`
        : null;

  return (
    <Link href={`/modelos/${modelo.slug}`}>
      <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="relative aspect-video w-full">
          <Image
            src={modelo.imagenUrl}
            alt={modelo.nombre}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 100vw"
            priority={priority}
          />
        </div>
        <CardContent className="flex flex-col gap-1 py-4">
          <p className="truncate font-medium">{modelo.nombre}</p>
          <p className="text-sm text-muted-foreground">
            {modelo.marca.nombre}
            {rango ? ` · ${rango}` : ""}
          </p>
          <Badge variant="secondary" className="mt-1 w-fit">
            {TIPO_COMBUSTIBLE_LABELS[modelo.tipoCombustible as TipoCombustible] ?? modelo.tipoCombustible}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
