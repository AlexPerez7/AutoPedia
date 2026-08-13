import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-24 text-center">
      <h1 className="text-4xl font-semibold">404</h1>
      <p className="text-muted-foreground">No encontramos esta página.</p>
      <Button render={<Link href="/" />} nativeButton={false} className="mt-2">
        Volver al inicio
      </Button>
    </div>
  );
}
