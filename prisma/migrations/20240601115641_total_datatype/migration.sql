/*
  Warnings:

  - You are about to alter the column `total` on the `CreditDebit` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE "CreditDebit" ALTER COLUMN "total" SET DATA TYPE DECIMAL(65,30);
