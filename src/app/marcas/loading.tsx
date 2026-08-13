import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingMarcas() {
  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
      <Skeleton className="mb-2 h-8 w-40" />
      <Skeleton className="mb-6 h-4 w-24" />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[4/3] w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
