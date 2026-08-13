import path from "node:path";
import fs from "node:fs";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { migrateLegacyData } from "../scripts/migrate-legacy-data";
import { buildPlaceholderSvg } from "../scripts/placeholder-image";
import { slugify } from "../src/lib/slug";

const db = new PrismaClient();

const REPO_ROOT = path.resolve(__dirname, "..");
const PLACEHOLDER_DIR = path.join(REPO_ROOT, "public", "images", "modelos");

type NuevoModelo = {
  marcaSlug: string;
  nombre: string;
  generacion?: string;
  anioInicio?: number;
  anioFin?: number;
  descripcion: string;
  cilindradaMotorLitros?: number;
  caballosFuerza?: number;
  torque?: number;
  configuracionMotor?: string;
  tipoCombustible?: "GASOLINA" | "DIESEL" | "ELECTRICO" | "HIBRIDO" | "HIBRIDO_ENCHUFABLE";
};

const MODELOS_ADICIONALES: NuevoModelo[] = [
  {
    marcaSlug: "bmw",
    nombre: "BMW M3",
    generacion: "E46",
    anioInicio: 2000,
    anioFin: 2006,
    descripcion:
      "Versión de alto rendimiento del Serie 3, con un seis en línea atmosférico de altas revoluciones convertido en un referente entre los sedanes deportivos de su generación.",
    cilindradaMotorLitros: 3.2,
    caballosFuerza: 343,
    torque: 365,
    configuracionMotor: "I6",
    tipoCombustible: "GASOLINA",
  },
  {
    marcaSlug: "bmw",
    nombre: "BMW Serie 3",
    generacion: "E30",
    anioInicio: 1982,
    anioFin: 1994,
    descripcion:
      "La generación que consolidó al Serie 3 como el sedán compacto deportivo de referencia, con motores de cuatro y seis cilindros y variantes de tracción trasera muy apreciadas por su manejo.",
    caballosFuerza: 320,
    configuracionMotor: "I4 / I6",
    tipoCombustible: "GASOLINA",
  },
  {
    marcaSlug: "lamborghini",
    nombre: "Lamborghini Countach",
    anioInicio: 1974,
    anioFin: 1990,
    descripcion:
      "Uno de los superdeportivos más icónicos de la historia, con su silueta en cuña y puertas de tijera que definieron la estética de Lamborghini durante más de una década.",
    cilindradaMotorLitros: 5.2,
    caballosFuerza: 455,
    configuracionMotor: "V12",
    tipoCombustible: "GASOLINA",
  },
  {
    marcaSlug: "lamborghini",
    nombre: "Lamborghini Huracán",
    anioInicio: 2014,
    anioFin: 2024,
    descripcion:
      "Sucesor del Gallardo, combina un V10 atmosférico de altas revoluciones con tracción integral, convirtiéndose en el superdeportivo de acceso a la marca durante una década.",
    cilindradaMotorLitros: 5.2,
    caballosFuerza: 610,
    torque: 560,
    configuracionMotor: "V10",
    tipoCombustible: "GASOLINA",
  },
  {
    marcaSlug: "subaru",
    nombre: "Subaru Impreza WRX STI",
    generacion: "GD",
    anioInicio: 2000,
    anioFin: 2007,
    descripcion:
      "Versión de alto rendimiento del Impreza, con motor boxer turboalimentado y tracción integral simétrica, forjada en el Mundial de Rally.",
    cilindradaMotorLitros: 2.0,
    caballosFuerza: 300,
    torque: 407,
    configuracionMotor: "Boxer 4 turbo",
    tipoCombustible: "GASOLINA",
  },
  {
    marcaSlug: "subaru",
    nombre: "Subaru BRZ",
    anioInicio: 2012,
    anioFin: 2021,
    descripcion:
      "Coupé deportivo de tracción trasera desarrollado junto a Toyota, con motor boxer de bajo centro de gravedad pensado para el manejo puro por sobre la potencia.",
    cilindradaMotorLitros: 2.0,
    caballosFuerza: 200,
    configuracionMotor: "Boxer 4",
    tipoCombustible: "GASOLINA",
  },
  {
    marcaSlug: "suzuki",
    nombre: "Suzuki Swift Sport",
    anioInicio: 2005,
    anioFin: 2010,
    descripcion:
      "Versión deportiva del Swift, liviana y ágil, apreciada por su relación peso-potencia y su manejo divertido en calles urbanas.",
    cilindradaMotorLitros: 1.6,
    caballosFuerza: 125,
    configuracionMotor: "I4",
    tipoCombustible: "GASOLINA",
  },
  {
    marcaSlug: "suzuki",
    nombre: "Suzuki Jimny",
    anioInicio: 1998,
    anioFin: 2018,
    descripcion:
      "Todoterreno compacto de chasis de escalera, célebre por su capacidad off-road desproporcionada para su tamaño.",
    cilindradaMotorLitros: 1.3,
    caballosFuerza: 85,
    configuracionMotor: "I4",
    tipoCombustible: "GASOLINA",
  },
  {
    marcaSlug: "audi",
    nombre: "Audi Quattro",
    anioInicio: 1980,
    anioFin: 1991,
    descripcion:
      "El modelo que introdujo la tracción integral permanente en el mundo del rally y los autos de calle, dando nombre al sistema Quattro que caracteriza a la marca hasta hoy.",
    cilindradaMotorLitros: 2.1,
    caballosFuerza: 200,
    configuracionMotor: "I5 turbo",
    tipoCombustible: "GASOLINA",
  },
  {
    marcaSlug: "audi",
    nombre: "Audi e-tron GT",
    anioInicio: 2021,
    descripcion:
      "Gran turismo eléctrico de cuatro puertas, con doble motor y tracción integral, representando el salto de Audi hacia la electrificación de sus modelos de alto rendimiento.",
    caballosFuerza: 522,
    torque: 630,
    configuracionMotor: "Doble motor eléctrico",
    tipoCombustible: "ELECTRICO",
  },
];

async function seedModelosAdicionales() {
  fs.mkdirSync(PLACEHOLDER_DIR, { recursive: true });

  for (const modelo of MODELOS_ADICIONALES) {
    const marca = await db.marca.findUnique({ where: { slug: modelo.marcaSlug } });
    if (!marca) {
      console.warn(`Marca "${modelo.marcaSlug}" no encontrada, se omite modelo "${modelo.nombre}"`);
      continue;
    }

    const slug = slugify(`${modelo.nombre}-${modelo.anioInicio ?? modelo.generacion ?? ""}`);
    const svgFileName = `${slug}.svg`;
    fs.writeFileSync(
      path.join(PLACEHOLDER_DIR, svgFileName),
      buildPlaceholderSvg(`${marca.nombre} ${modelo.nombre}`),
    );

    await db.modelo.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        nombre: modelo.nombre,
        marcaId: marca.id,
        generacion: modelo.generacion,
        anioInicio: modelo.anioInicio,
        anioFin: modelo.anioFin,
        descripcion: modelo.descripcion,
        imagenUrl: `/images/modelos/${svgFileName}`,
        cilindradaMotorLitros: modelo.cilindradaMotorLitros,
        caballosFuerza: modelo.caballosFuerza,
        torque: modelo.torque,
        configuracionMotor: modelo.configuracionMotor,
        tipoCombustible: modelo.tipoCombustible ?? "GASOLINA",
      },
    });
  }

  console.log(`Contenido adicional: ${MODELOS_ADICIONALES.length} modelos agregados.`);
}

async function seedAdminUser() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@autopedia.dev";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "Admin1234!";

  const existente = await db.user.findUnique({ where: { email } });
  if (existente) return;

  const passwordHash = await bcrypt.hash(password, 10);
  await db.user.create({
    data: {
      name: "Admin AutoPedia",
      email,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`Usuario admin creado -> email: ${email} / password: ${password}`);
}

async function main() {
  await migrateLegacyData(db);
  await seedModelosAdicionales();
  await seedAdminUser();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
