/*
  Warnings:

  - The primary key for the `LoginAuth` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LoginAuth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "LoginAuth" DROP CONSTRAINT "LoginAuth_pkey",
DROP COLUMN "id",
ADD COLUMN     "Id" SERIAL NOT NULL,
ADD CONSTRAINT "LoginAuth_pkey" PRIMARY KEY ("Id");
