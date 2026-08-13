import Link from "next/link";
import { Suspense } from "react";
import { CarIcon, MenuIcon } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SearchForm } from "@/components/search-form";
import { ThemeToggle } from "@/components/theme-toggle";
import { GuestMenu, UserMenu } from "@/components/user-menu";
import { cerrarSesion } from "@/actions/auth";

const NAV_LINKS = [
  { href: "/marcas", label: "Marcas" },
  { href: "/modelos", label: "Modelos" },
];

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-heading font-semibold">
          <CarIcon className="size-5" />
          AutoPedia
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              render={<Link href={link.href} />}
            >
              {link.label}
            </Button>
          ))}
        </nav>

        <div className="hidden flex-1 justify-center px-4 md:flex">
          <Suspense fallback={<div className="w-full max-w-sm" />}>
            <SearchForm className="w-full max-w-sm" />
          </Suspense>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <ThemeToggle />
          <div className="hidden md:block">
            {user ? (
              <UserMenu name={user.name ?? user.email ?? "Cuenta"} isAdmin={user.role === "ADMIN"} />
            ) : (
              <GuestMenu />
            )}
          </div>

          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="md:hidden" />}
            >
              <MenuIcon className="size-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Menú</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 px-4">
                <Suspense fallback={null}>
                  <SearchForm />
                </Suspense>
                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link href="/favoritos" className="rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                    Favoritos
                  </Link>
                  {user?.role === "ADMIN" && (
                    <Link href="/admin/marcas" className="rounded-md px-2 py-1.5 text-sm hover:bg-muted">
                      Panel admin
                    </Link>
                  )}
                </nav>
                <div className="border-t pt-4">
                  {user ? (
                    <form action={cerrarSesion}>
                      <Button variant="outline" size="sm" className="w-full" type="submit">
                        Cerrar sesión
                      </Button>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button size="sm" render={<Link href="/login" />}>
                        Iniciar sesión
                      </Button>
                      <Button variant="outline" size="sm" render={<Link href="/registro" />}>
                        Registrarse
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
