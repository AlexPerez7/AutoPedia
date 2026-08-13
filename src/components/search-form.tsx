"use client";

import { useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchForm({ className }: { className?: string }) {
  const searchParams = useSearchParams();

  return (
    <form action="/buscar" method="get" className={className}>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          name="q"
          placeholder="Buscar marcas o modelos..."
          defaultValue={searchParams.get("q") ?? ""}
          className="pl-8"
        />
      </div>
    </form>
  );
}
