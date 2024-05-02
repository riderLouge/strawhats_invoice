/*
  Warnings:

  - Added the required column `passwordResetExpiresAt` to the `LoginAuth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordResetOTP` to the `LoginAuth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoginAuth" ADD COLUMN     "passwordResetExpiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "passwordResetOTP" TEXT NOT NULL;
