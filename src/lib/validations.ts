import { z } from "zod";

export const ROLES = ["USER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const TIPOS_COMBUSTIBLE = [
  "GASOLINA",
  "DIESEL",
  "ELECTRICO",
  "HIBRIDO",
  "HIBRIDO_ENCHUFABLE",
] as const;
export type TipoCombustible = (typeof TIPOS_COMBUSTIBLE)[number];

export const TIPO_COMBUSTIBLE_LABELS: Record<TipoCombustible, string> = {
  GASOLINA: "Gasolina",
  DIESEL: "Diésel",
  ELECTRICO: "Eléctrico",
  HIBRIDO: "Híbrido",
  HIBRIDO_ENCHUFABLE: "Híbrido enchufable",
};

const optionalInt = z.coerce.number().int().optional().or(z.literal("").transform(() => undefined));
const optionalFloat = z.coerce.number().optional().or(z.literal("").transform(() => undefined));

export const marcaSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  anioFundacion: z.coerce.number().int().min(1800).max(new Date().getFullYear()),
  paisOrigen: z.string().trim().min(1, "El país es obligatorio").max(50),
  descripcion: z.string().trim().min(1, "La descripción es obligatoria"),
  fundador: z.string().trim().max(100).optional().or(z.literal("").transform(() => undefined)),
});

export type MarcaInput = z.infer<typeof marcaSchema>;

export const modeloSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio").max(100),
  marcaId: z.string().trim().min(1, "Seleccioná una marca"),
  generacion: z.string().trim().max(20).optional().or(z.literal("").transform(() => undefined)),
  anioInicio: optionalInt,
  anioFin: optionalInt,
  descripcion: z.string().trim().min(1, "La descripción es obligatoria"),
  cilindradaMotorLitros: optionalFloat,
  caballosFuerza: optionalInt,
  torque: optionalInt,
  configuracionMotor: z.string().trim().max(50).optional().or(z.literal("").transform(() => undefined)),
  tipoCombustible: z.enum(TIPOS_COMBUSTIBLE),
});

export type ModeloInput = z.infer<typeof modeloSchema>;

export const registroSchema = z
  .object({
    name: z.string().trim().min(1, "El nombre es obligatorio").max(100),
    email: z.string().trim().email("Email inválido"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegistroInput = z.infer<typeof registroSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Email inválido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export type LoginInput = z.infer<typeof loginSchema>;
