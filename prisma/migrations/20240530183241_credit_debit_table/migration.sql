/*
  Warnings:

  - Added the required column `invoiceId` to the `CreditDebit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreditDebit" ADD COLUMN     "invoiceId" TEXT NOT NULL;
