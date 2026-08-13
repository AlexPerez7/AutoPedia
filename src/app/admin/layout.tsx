import Link from "next/link";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b bg-muted/30">
        <nav className="mx-auto flex w-full max-w-4xl gap-1 px-4 py-2 text-sm">
          <Link href="/admin/marcas" className="rounded-md px-3 py-1.5 hover:bg-muted">
            Marcas
          </Link>
          <Link href="/admin/modelos" className="rounded-md px-3 py-1.5 hover:bg-muted">
            Modelos
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
