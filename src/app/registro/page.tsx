import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RegistroForm } from "@/components/registro-form";

export const metadata = { title: "Crear cuenta" };

export default function RegistroPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Crear cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <RegistroForm />
        </CardContent>
      </Card>
    </div>
  );
}
