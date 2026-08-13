"use client";

import { useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { HeartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavoritoMarca, toggleFavoritoModelo } from "@/actions/favoritos";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  tipo,
  id,
  isFavorito,
  isAuthenticated,
}: {
  tipo: "marca" | "modelo";
  id: string;
  isFavorito: boolean;
  isAuthenticated: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={isPending}
      onClick={() => {
        if (!isAuthenticated) {
          router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
          return;
        }
        startTransition(async () => {
          if (tipo === "marca") {
            await toggleFavoritoMarca(id, pathname);
          } else {
            await toggleFavoritoModelo(id, pathname);
          }
        });
      }}
    >
      <HeartIcon className={cn("size-4", isFavorito && "fill-destructive text-destructive")} />
      {isFavorito ? "En favoritos" : "Agregar a favoritos"}
    </Button>
  );
}
