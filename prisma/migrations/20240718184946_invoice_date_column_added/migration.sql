/*
  Warnings:

  - Added the required column `invoice_date` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "invoice_date" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'NOT_ASSIGNED',
ALTER COLUMN "assigned_date" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'NOT_DELIVERED';
