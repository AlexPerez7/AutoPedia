# AutoPedia

Enciclopedia web de autos: explora marcas y modelos, con ficha técnica, fotos, búsqueda y favoritos.

Reescritura completa del proyecto original (Django + SQLite + Bootstrap) sobre un stack moderno:

- **Next.js 16** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS** + **shadcn/ui** (Base UI) + `next-themes` (modo claro/oscuro)
- **Prisma** + **PostgreSQL** ([Neon](https://neon.tech), tier gratuito)
- **Vercel Blob** para las imágenes subidas desde el panel admin
- **Auth.js (NextAuth v5)** con Credentials (email + contraseña) y roles `USER` / `ADMIN`
- **Zod** para validación, **Server Actions** para las mutaciones (sin API REST intermedia)

## Setup local

1. Creá un proyecto gratuito en [Neon](https://neon.tech) y copiá su connection string.
2. Creá un Blob Store gratuito en tu [proyecto de Vercel](https://vercel.com/docs/vercel-blob) (Storage → Create Database → Blob) y copiá el `BLOB_READ_WRITE_TOKEN`. Si preferís no crear el proyecto en Vercel todavía, podés omitir esta variable: las subidas de imágenes van a fallar con un error claro hasta que la configures.
3. Copiá `.env.example` a `.env` y completá las tres variables.

```bash
npm install
npx prisma migrate dev   # crea el schema en tu base de Neon
npx prisma db seed       # migra los datos del sitio Django original + contenido enriquecido
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

El seed crea un usuario admin de desarrollo:

```
email: admin@autopedia.dev
password: Admin1234!
```

(Configurable con las variables de entorno `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` antes de correr el seed.)

## Variables de entorno

Ver `.env.example`:

- `DATABASE_URL` — connection string de Postgres (Neon u otro proveedor).
- `AUTH_SECRET` — secreto de Auth.js. **Generar uno nuevo antes de deployar** (`npx auth secret`).
- `BLOB_READ_WRITE_TOKEN` — token del Blob Store de Vercel, usado por `src/lib/storage.ts` para subir/borrar las imágenes de marcas y modelos.

## Estructura

- `prisma/schema.prisma` — modelo de datos (`User`, `Marca`, `Modelo`, favoritos).
- `prisma/seed.ts` — orquesta la migración legacy + contenido adicional + usuario admin.
- `scripts/migrate-legacy-data.ts` — lee el `db.sqlite3` del proyecto Django original (si todavía existe en el repo) y migra marcas/modelos/imágenes.
- `src/app/` — rutas (App Router): home, marcas, modelos, búsqueda, favoritos, login/registro, panel admin.
- `src/actions/` — Server Actions (auth, marcas, modelos, favoritos).
- `src/lib/` — Prisma client, config de Auth.js, validaciones Zod, storage de imágenes subidas (Vercel Blob).

## Deploy a Vercel

1. Importá el repo en [Vercel](https://vercel.com/new).
2. En el proyecto de Vercel, agregá un Blob Store (Storage → Create Database → Blob) — esto define `BLOB_READ_WRITE_TOKEN` automáticamente para los deploys.
3. Configurá las variables de entorno del proyecto: `DATABASE_URL` (tu base de Neon) y `AUTH_SECRET` (generado con `npx auth secret`, distinto al de desarrollo).
4. Corré `npx prisma migrate deploy` contra la base de producción antes del primer deploy (o agregalo como build command / paso previo).

Con el plan Hobby de Vercel + el free tier de Neon + el free tier de Vercel Blob, este proyecto corre gratis para uso personal/no comercial.

## Scripts

- `npm run dev` — servidor de desarrollo.
- `npm run build` / `npm start` — build de producción.
- `npm run lint` — ESLint.
- `npm run db:seed` (o `npx prisma db seed`) — vuelve a correr el seed (es idempotente).
