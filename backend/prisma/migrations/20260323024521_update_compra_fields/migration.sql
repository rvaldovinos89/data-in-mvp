/*
  Warnings:

  - You are about to alter the column `monto` on the `Compra` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `precioVenta` on the `Proyecto` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `presupuesto` on the `Proyecto` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Compra" ADD COLUMN     "categoria" TEXT,
ADD COLUMN     "proveedor" TEXT,
ALTER COLUMN "monto" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Proyecto" ALTER COLUMN "precioVenta" SET DATA TYPE INTEGER,
ALTER COLUMN "presupuesto" SET DATA TYPE INTEGER;
