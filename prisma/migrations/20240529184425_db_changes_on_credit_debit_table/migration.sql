/*
  Warnings:

  - The primary key for the `CreditDebit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `pending` on the `CreditDebit` table. All the data in the column will be lost.
  - The required column `credit_debit_id` was added to the `CreditDebit` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `total` to the `CreditDebit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `CreditDebit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreditDebit" DROP CONSTRAINT "CreditDebit_pkey",
DROP COLUMN "pending",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "credit_debit_id" TEXT NOT NULL,
ADD COLUMN     "total" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "CreditDebit_pkey" PRIMARY KEY ("credit_debit_id");
