/*
  Warnings:

  - You are about to drop the column `billedProducts` on the `SupplierBill` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[billNumber]` on the table `SupplierBill` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `SupplierBill` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `supplierId` to the `SupplierBill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `SupplierBill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `SupplierBill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupplierBill" DROP COLUMN "billedProducts",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "products" JSONB[],
ADD COLUMN     "supplierId" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "SupplierBill_billNumber_key" ON "SupplierBill"("billNumber");

-- AddForeignKey
ALTER TABLE "SupplierBill" ADD CONSTRAINT "SupplierBill_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierBill" ADD CONSTRAINT "SupplierBill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "LoginAuth"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
