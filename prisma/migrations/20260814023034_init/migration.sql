-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Marca" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "anioFundacion" INTEGER NOT NULL,
    "paisOrigen" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fundador" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Modelo" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "marcaId" TEXT NOT NULL,
    "generacion" TEXT,
    "anioInicio" INTEGER,
    "anioFin" INTEGER,
    "descripcion" TEXT NOT NULL,
    "imagenUrl" TEXT NOT NULL,
    "cilindradaMotorLitros" DOUBLE PRECISION,
    "caballosFuerza" INTEGER,
    "torque" INTEGER,
    "configuracionMotor" TEXT,
    "tipoCombustible" TEXT NOT NULL DEFAULT 'GASOLINA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Modelo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteMarca" (
    "userId" TEXT NOT NULL,
    "marcaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteMarca_pkey" PRIMARY KEY ("userId","marcaId")
);

-- CreateTable
CREATE TABLE "FavoriteModelo" (
    "userId" TEXT NOT NULL,
    "modeloId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FavoriteModelo_pkey" PRIMARY KEY ("userId","modeloId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Marca_slug_key" ON "Marca"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Modelo_slug_key" ON "Modelo"("slug");

-- CreateIndex
CREATE INDEX "Modelo_marcaId_idx" ON "Modelo"("marcaId");

-- AddForeignKey
ALTER TABLE "Modelo" ADD CONSTRAINT "Modelo_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteMarca" ADD CONSTRAINT "FavoriteMarca_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteMarca" ADD CONSTRAINT "FavoriteMarca_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteModelo" ADD CONSTRAINT "FavoriteModelo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteModelo" ADD CONSTRAINT "FavoriteModelo_modeloId_fkey" FOREIGN KEY ("modeloId") REFERENCES "Modelo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
