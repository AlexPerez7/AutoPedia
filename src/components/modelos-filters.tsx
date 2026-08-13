import Link from "next/link";
import { TIPOS_COMBUSTIBLE, TIPO_COMBUSTIBLE_LABELS } from "@/lib/validations";

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function ModelosFilters({
  marcas,
  marcaActual,
  tipoCombustibleActual,
}: {
  marcas: { slug: string; nombre: string }[];
  marcaActual?: string;
  tipoCombustibleActual?: string;
}) {
  return (
    <form method="get" className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="marca" className="text-xs text-muted-foreground">
          Marca
        </label>
        <select id="marca" name="marca" defaultValue={marcaActual ?? ""} className={selectClassName}>
          <option value="">Todas</option>
          {marcas.map((marca) => (
            <option key={marca.slug} value={marca.slug}>
              {marca.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tipoCombustible" className="text-xs text-muted-foreground">
          Tipo de combustible
        </label>
        <select
          id="tipoCombustible"
          name="tipoCombustible"
          defaultValue={tipoCombustibleActual ?? ""}
          className={selectClassName}
        >
          <option value="">Todos</option>
          {TIPOS_COMBUSTIBLE.map((tipo) => (
            <option key={tipo} value={tipo}>
              {TIPO_COMBUSTIBLE_LABELS[tipo]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="h-8 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/80"
      >
        Filtrar
      </button>
      {(marcaActual || tipoCombustibleActual) && (
        <Link href="/modelos" className="text-sm text-muted-foreground underline underline-offset-4">
          Limpiar filtros
        </Link>
      )}
    </form>
  );
}
