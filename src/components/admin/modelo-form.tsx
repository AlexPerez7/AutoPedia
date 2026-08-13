"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TIPOS_COMBUSTIBLE, TIPO_COMBUSTIBLE_LABELS } from "@/lib/validations";
import type { ActionState } from "@/actions/auth";

const initialState: ActionState = {};

const selectClassName =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function ModeloForm({
  action,
  marcas,
  defaultValues,
  submitLabel,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  marcas: { id: string; nombre: string }[];
  defaultValues?: {
    nombre: string;
    marcaId: string;
    generacion: string | null;
    anioInicio: number | null;
    anioFin: number | null;
    descripcion: string;
    cilindradaMotorLitros: number | null;
    caballosFuerza: number | null;
    torque: number | null;
    configuracionMotor: string | null;
    tipoCombustible: string;
  };
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="nombre">Nombre</Label>
          <Input id="nombre" name="nombre" defaultValue={defaultValues?.nombre} required />
          {state.fieldErrors?.nombre && (
            <p className="text-xs text-destructive">{state.fieldErrors.nombre}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="marcaId">Marca</Label>
          <select
            id="marcaId"
            name="marcaId"
            defaultValue={defaultValues?.marcaId ?? ""}
            className={selectClassName}
            required
          >
            <option value="" disabled>
              Selecciona una marca
            </option>
            {marcas.map((marca) => (
              <option key={marca.id} value={marca.id}>
                {marca.nombre}
              </option>
            ))}
          </select>
          {state.fieldErrors?.marcaId && (
            <p className="text-xs text-destructive">{state.fieldErrors.marcaId}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="generacion">Generación</Label>
          <Input id="generacion" name="generacion" defaultValue={defaultValues?.generacion ?? ""} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="anioInicio">Año inicio</Label>
          <Input
            id="anioInicio"
            name="anioInicio"
            type="number"
            defaultValue={defaultValues?.anioInicio ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="anioFin">Año fin</Label>
          <Input id="anioFin" name="anioFin" type="number" defaultValue={defaultValues?.anioFin ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tipoCombustible">Tipo de combustible</Label>
        <select
          id="tipoCombustible"
          name="tipoCombustible"
          defaultValue={defaultValues?.tipoCombustible ?? "GASOLINA"}
          className={selectClassName}
        >
          {TIPOS_COMBUSTIBLE.map((tipo) => (
            <option key={tipo} value={tipo}>
              {TIPO_COMBUSTIBLE_LABELS[tipo]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="cilindradaMotorLitros">Cilindrada (L)</Label>
          <Input
            id="cilindradaMotorLitros"
            name="cilindradaMotorLitros"
            type="number"
            step="0.1"
            defaultValue={defaultValues?.cilindradaMotorLitros ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="caballosFuerza">HP</Label>
          <Input
            id="caballosFuerza"
            name="caballosFuerza"
            type="number"
            defaultValue={defaultValues?.caballosFuerza ?? ""}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="torque">Torque (Nm)</Label>
          <Input id="torque" name="torque" type="number" defaultValue={defaultValues?.torque ?? ""} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="configuracionMotor">Configuración de motor</Label>
        <Input
          id="configuracionMotor"
          name="configuracionMotor"
          defaultValue={defaultValues?.configuracionMotor ?? ""}
          placeholder="Ej: V6 biturbo"
        />
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
        <Label htmlFor="imagen">
          Imagen {defaultValues ? "(dejar vacío para mantener la actual)" : ""}
        </Label>
        <Input id="imagen" name="imagen" type="file" accept="image/jpeg,image/png,image/webp" />
        {state.fieldErrors?.imagen && (
          <p className="text-xs text-destructive">{state.fieldErrors.imagen}</p>
        )}
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending} className="mt-2 w-fit">
        {pending ? "Guardando..." : submitLabel}
      </Button>
    </form>
  );
}
