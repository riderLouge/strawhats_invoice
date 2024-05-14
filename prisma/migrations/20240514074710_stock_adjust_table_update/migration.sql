/*
  Warnings:

  - You are about to drop the `StockAdjust` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "StockAdjust";

-- CreateTable
CREATE TABLE "Stock_Update" (
    "id" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,
    "product_quantity" INTEGER NOT NULL,
    "Reason" TEXT NOT NULL,
    "damaged_quantity" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stock_Update_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stock_Update" ADD CONSTRAINT "Stock_Update_userId_fkey" FOREIGN KEY ("userId") REFERENCES "LoginAuth"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
