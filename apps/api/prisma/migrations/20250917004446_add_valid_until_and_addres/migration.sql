/*
  Warnings:

  - Added the required column `validUntil` to the `promotion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `store_front` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."promotion" ADD COLUMN     "validUntil" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."store_front" ADD COLUMN     "location" TEXT NOT NULL;
