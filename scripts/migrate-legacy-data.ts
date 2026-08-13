import path from "node:path";
import fs from "node:fs";
import Database from "better-sqlite3";
import type { PrismaClient } from "@prisma/client";
import { slugify } from "../src/lib/slug";

type LegacyMarca = {
  id: number;
  nombre: string;
  logo: string;
  descripcion: string;
  año_fundación: number;
  fundador: string | null;
  pais_origen: string;
};

type LegacyModelo = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  configuracion_motor: string | null;
  marca_id: number;
  año_fin: number | null;
  año_inicio: number | null;
  caballos_fuerza: number | null;
  cilindrada_motor_litros: number | null;
  generacion: string | null;
  torque: number | null;
};

const REPO_ROOT = path.resolve(__dirname, "..");
const LEGACY_DB_PATH = path.join(REPO_ROOT, "AutoPedia", "db.sqlite3");
const LEGACY_MEDIA_ROOT = path.join(REPO_ROOT, "AutoPedia", "media");
const PUBLIC_IMAGES_ROOT = path.join(REPO_ROOT, "public", "images");

function copyMediaFile(legacyRelativePath: string, destDir: string, destBaseName: string) {
  const sourcePath = path.join(LEGACY_MEDIA_ROOT, legacyRelativePath);
  const ext = path.extname(sourcePath) || ".jpg";
  const destFileName = `${destBaseName}${ext}`;
  const destPath = path.join(destDir, destFileName);

  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(sourcePath, destPath);

  return destFileName;
}

export function legacyDataAvailable(): boolean {
  return fs.existsSync(LEGACY_DB_PATH);
}

export async function migrateLegacyData(db: PrismaClient): Promise<Map<string, string>> {
  const legacyIdToSlug = new Map<string, string>();

  if (!legacyDataAvailable()) {
    console.log("No se encontró AutoPedia/db.sqlite3 (¿ya se borró la carpeta Django?). Se omite la migración legacy.");
    return legacyIdToSlug;
  }

  const legacyDb = new Database(LEGACY_DB_PATH, { readonly: true });

  const marcas = legacyDb.prepare("SELECT * FROM marcas_marca").all() as LegacyMarca[];
  const modelos = legacyDb.prepare("SELECT * FROM autos_modelo").all() as LegacyModelo[];

  legacyDb.close();

  const marcaLegacyIdToNewId = new Map<number, string>();

  for (const marca of marcas) {
    const slug = slugify(marca.nombre);
    const logoFileName = copyMediaFile(
      marca.logo,
      path.join(PUBLIC_IMAGES_ROOT, "marcas"),
      slug,
    );

    const created = await db.marca.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        nombre: marca.nombre,
        logoUrl: `/images/marcas/${logoFileName}`,
        anioFundacion: marca.año_fundación,
        paisOrigen: marca.pais_origen,
        descripcion: marca.descripcion,
        fundador: marca.fundador ?? undefined,
      },
    });

    marcaLegacyIdToNewId.set(marca.id, created.id);
    legacyIdToSlug.set(`marca:${marca.id}`, slug);
  }

  for (const modelo of modelos) {
    const marcaId = marcaLegacyIdToNewId.get(modelo.marca_id);
    if (!marcaId) continue;

    const slug = slugify(`${modelo.nombre}-${modelo.año_inicio ?? modelo.id}`);
    const imagenFileName = copyMediaFile(
      modelo.imagen,
      path.join(PUBLIC_IMAGES_ROOT, "modelos"),
      slug,
    );

    await db.modelo.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        nombre: modelo.nombre,
        marcaId,
        generacion: modelo.generacion ?? undefined,
        anioInicio: modelo.año_inicio ?? undefined,
        anioFin: modelo.año_fin ?? undefined,
        descripcion: modelo.descripcion,
        imagenUrl: `/images/modelos/${imagenFileName}`,
        cilindradaMotorLitros: modelo.cilindrada_motor_litros ?? undefined,
        caballosFuerza: modelo.caballos_fuerza ?? undefined,
        torque: modelo.torque ?? undefined,
        configuracionMotor: modelo.configuracion_motor ?? undefined,
        tipoCombustible: "GASOLINA",
      },
    });

    legacyIdToSlug.set(`modelo:${modelo.id}`, slug);
  }

  console.log(`Migración legacy: ${marcas.length} marcas y ${modelos.length} modelos importados.`);

  return legacyIdToSlug;
}
