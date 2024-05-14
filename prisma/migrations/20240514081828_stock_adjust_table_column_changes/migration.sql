/*
  Warnings:

  - Added the required column `product_name` to the `Stock_Update` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stock_Update" ADD COLUMN     "product_name" TEXT NOT NULL;
