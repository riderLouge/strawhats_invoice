/*
  Warnings:

  - Added the required column `address` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gstin` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stateCode` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "gstin" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "stateCode" TEXT NOT NULL;
