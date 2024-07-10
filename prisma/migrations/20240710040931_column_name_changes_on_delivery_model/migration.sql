/*
  Warnings:

  - You are about to drop the column `assignedDate` on the `Delivery` table. All the data in the column will be lost.
  - You are about to drop the column `staffId` on the `Delivery` table. All the data in the column will be lost.
  - Added the required column `assigned_date` to the `Delivery` table without a default value. This is not possible if the table is not empty.
  - Added the required column `staff_id` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_staffId_fkey";

-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "assignedDate",
DROP COLUMN "staffId",
ADD COLUMN     "assigned_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "staff_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Delivery" ADD CONSTRAINT "Delivery_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "Staff"("userid") ON DELETE RESTRICT ON UPDATE CASCADE;
