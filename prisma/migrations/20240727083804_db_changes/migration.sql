/*
  Warnings:

  - You are about to drop the column `user_id` on the `Delivery` table. All the data in the column will be lost.
  - Changed the type of `role` on the `LoginAuth` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `Staff` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('OWNER', 'ADMIN', 'DELIVERY', 'STAFF');

-- DropForeignKey
ALTER TABLE "Delivery" DROP CONSTRAINT "Delivery_user_id_fkey";

-- AlterTable
ALTER TABLE "Delivery" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "LoginAuth" DROP COLUMN "role",
ADD COLUMN     "role" "UserRoles" NOT NULL;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "role",
ADD COLUMN     "role" "UserRoles" NOT NULL;
