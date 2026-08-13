export function Footer() {
  return (
    <footer className="mt-auto border-t py-6">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} AutoPedia. Enciclopedia web de autos.
      </div>
    </footer>
  );
}
