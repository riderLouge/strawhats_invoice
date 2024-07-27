/*
  Warnings:

  - You are about to drop the column `role` on the `LoginAuth` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Staff` table. All the data in the column will be lost.
  - Added the required column `user_role` to the `LoginAuth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_role` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LoginAuth" DROP COLUMN "role",
ADD COLUMN     "user_role" "UserRoles" NOT NULL;

-- AlterTable
ALTER TABLE "Staff" DROP COLUMN "role",
ADD COLUMN     "user_role" "UserRoles" NOT NULL;
