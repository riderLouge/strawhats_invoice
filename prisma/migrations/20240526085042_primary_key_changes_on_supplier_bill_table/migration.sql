/*
  Warnings:

  - The primary key for the `SupplierBill` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropIndex
DROP INDEX "SupplierBill_billNumber_key";

-- AlterTable
ALTER TABLE "SupplierBill" DROP CONSTRAINT "SupplierBill_pkey",
ADD CONSTRAINT "SupplierBill_pkey" PRIMARY KEY ("id");
