/*
  Warnings:

  - The primary key for the `LoginAuth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `Id` on the `LoginAuth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LoginAuth" DROP CONSTRAINT "LoginAuth_pkey",
DROP COLUMN "Id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "passwordResetExpiresAt" DROP NOT NULL,
ALTER COLUMN "passwordResetOTP" DROP NOT NULL,
ADD CONSTRAINT "LoginAuth_pkey" PRIMARY KEY ("id");
