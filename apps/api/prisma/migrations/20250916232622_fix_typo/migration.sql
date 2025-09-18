/*
  Warnings:

  - You are about to drop the column `bannerImgae` on the `store_front` table. All the data in the column will be lost.
  - Added the required column `bannerImage` to the `store_front` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."store_front" DROP COLUMN "bannerImgae",
ADD COLUMN     "bannerImage" BYTEA NOT NULL;
