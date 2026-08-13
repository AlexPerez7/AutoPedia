"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ActionState } from "@/actions/auth";

const initialState: ActionState = {};

export function MarcaForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  defaultValues?: {
    nombre: string;
    anioFundacion: number;
    paisOrigen: string;
    descripcion: string;
    fundador: string | null;
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="nombre">Nombre</Label>
        <Input id="nombre" name="nombre" defaultValue={defaultValues?.nombre} required />
        {state.fieldErrors?.nombre && (
          <p className="text-xs text-destructive">{state.fieldErrors.nombre}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="anioFundacion">Año de fundación</Label>
          <Input
            id="anioFundacion"
            name="anioFundacion"
            type="number"
            defaultValue={defaultValues?.anioFundacion}
            required
          />
          {state.fieldErrors?.anioFundacion && (
            <p className="text-xs text-destructive">{state.fieldErrors.anioFundacion}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="paisOrigen">País de origen</Label>
          <Input id="paisOrigen" name="paisOrigen" defaultValue={defaultValues?.paisOrigen} required />
          {state.fieldErrors?.paisOrigen && (
            <p className="text-xs text-destructive">{state.fieldErrors.paisOrigen}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fundador">Fundador (opcional)</Label>
        <Input id="fundador" name="fundador" defaultValue={defaultValues?.fundador ?? ""} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          rows={5}
          defaultValue={defaultValues?.descripcion}
          required
        />
        {state.fieldErrors?.descripcion && (
          <p className="text-xs text-destructive">{state.fieldErrors.descripcion}</p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="logo">Logo {defaultValues ? "(dejar vacío para mantener el actual)" : ""}</Label>
        <Input id="logo" name="logo" type="file" accept="image/jpeg,image/png,image/webp" />
        {state.fieldErrors?.logo && (
          <p className="text-xs text-destructive">{state.fieldErrors.logo}</p>
        )}
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="mt-2 w-fit">
        {pending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
