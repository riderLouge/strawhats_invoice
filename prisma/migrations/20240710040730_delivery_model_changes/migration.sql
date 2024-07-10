/*
  Warnings:

  - The primary key for the `Delivery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `area` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `billNumbers` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Delivery` table. All the data in the column will be lost.
  - Added the required column `assignedDate` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_pkey",
DROP COLUMN "area",
DROP COLUMN "billNumbers",
DROP COLUMN "date",
ADD COLUMN     "areas" TEXT[],
ADD COLUMN     "assignedDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shops" JSONB[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET DEFAULT 'NOT_COMPLETED',
ADD CONSTRAINT "Delivery_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "Staff"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;
