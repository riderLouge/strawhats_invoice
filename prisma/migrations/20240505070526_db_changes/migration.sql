/*
  Warnings:

  - You are about to drop the column `currentPrice` on the `Invoice` table. All the data in the column will be lost.
  - Added the required column `staffId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "currentPrice",
ADD COLUMN     "staffId" TEXT NOT NULL;
