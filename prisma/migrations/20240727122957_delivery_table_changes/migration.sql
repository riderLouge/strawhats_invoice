/*
  Warnings:

  - Added the required column `delivery_date` to the `Delivery` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Delivery" ADD COLUMN     "delivery_date" TIMESTAMP(3) NOT NULL;
