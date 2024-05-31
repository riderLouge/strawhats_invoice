/*
  Warnings:

  - Changed the type of `invoiceNumber` on the `CreditDebit` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CreditDebit" DROP COLUMN "invoiceNumber",
ADD COLUMN     "invoiceNumber" INTEGER NOT NULL;
