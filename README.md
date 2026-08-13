# AutoPedia

Enciclopedia web de autos: explora marcas y modelos, con ficha técnica, fotos, búsqueda y favoritos.

Reescritura completa del proyecto original (Django + SQLite + Bootstrap) sobre un stack moderno:

- **Next.js 16** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS** + **shadcn/ui** (Base UI) + `next-themes` (modo claro/oscuro)
- **Prisma** + **SQLite** (desarrollo local, cero configuración)
- **Auth.js (NextAuth v5)** con Credentials (email + contraseña) y roles `USER` / `ADMIN`
- **Zod** para validación, **Server Actions** para las mutaciones (sin API REST intermedia)

## Setup local

```bash
npm install
npx prisma migrate dev   # crea prisma/dev.db según el schema
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

Ver `.env` (no versionado):

- `DATABASE_URL` — conexión de Prisma (`file:./dev.db` en desarrollo).
- `AUTH_SECRET` — secreto de Auth.js. **Generar uno nuevo antes de deployar** (`npx auth secret`).

## Estructura

- `prisma/schema.prisma` — modelo de datos (`User`, `Marca`, `Modelo`, favoritos).
- `prisma/seed.ts` — orquesta la migración legacy + contenido adicional + usuario admin.
- `scripts/migrate-legacy-data.ts` — lee el `db.sqlite3` del proyecto Django original (si todavía existe en el repo) y migra marcas/modelos/imágenes.
- `src/app/` — rutas (App Router): home, marcas, modelos, búsqueda, favoritos, login/registro, panel admin.
- `src/actions/` — Server Actions (auth, marcas, modelos, favoritos).
- `src/lib/` — Prisma client, config de Auth.js, validaciones Zod, storage de imágenes subidas.

## Notas para producción

Este proyecto está pensado para correr localmente con SQLite y guardar imágenes subidas en `public/uploads/`. Si se deploya a una plataforma serverless como Vercel, el filesystem es efímero, así que antes de deployar ahí hay que:

1. Cambiar el datasource de Prisma a Postgres (por ejemplo [Neon](https://neon.tech) o [Supabase](https://supabase.com)) y correr `prisma migrate deploy`.
2. Reemplazar `src/lib/storage.ts` por un backend de objetos (Vercel Blob, S3, Cloudinary) para las imágenes subidas desde el panel admin.
3. Generar un `AUTH_SECRET` nuevo y configurar las variables de entorno en la plataforma.

## Scripts

- `npm run dev` — servidor de desarrollo.
- `npm run build` / `npm start` — build de producción.
- `npm run lint` — ESLint.
- `npm run db:seed` (o `npx prisma db seed`) — vuelve a correr el seed (es idempotente).
