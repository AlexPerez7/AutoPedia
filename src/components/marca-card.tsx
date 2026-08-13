import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

export function MarcaCard({
  marca,
  priority = false,
}: {
  marca: { slug: string; nombre: string; logoUrl: string; paisOrigen: string };
  priority?: boolean;
}) {
  return (
    <Link href={`/marcas/${marca.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent className="flex flex-col items-center gap-3 py-6">
          <div className="relative flex h-24 w-full items-center justify-center">
            <Image
              src={marca.logoUrl}
              alt={`Logo de ${marca.nombre}`}
              fill
              className="object-contain"
              sizes="200px"
              priority={priority}
            />
          </div>
          <div className="text-center">
            <p className="font-medium">{marca.nombre}</p>
            <p className="text-xs text-muted-foreground">{marca.paisOrigen}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
