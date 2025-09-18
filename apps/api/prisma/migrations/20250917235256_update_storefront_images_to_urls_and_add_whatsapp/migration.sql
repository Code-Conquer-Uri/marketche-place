/*
  Warnings:

  - You are about to drop the column `bannerImage` on the `store_front` table. All the data in the column will be lost.
  - You are about to drop the column `logoImage` on the `store_front` table. All the data in the column will be lost.
  - Added the required column `bannerImageBlurData` to the `store_front` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bannerImageUrl` to the `store_front` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoImageBlurData` to the `store_front` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoImageUrl` to the `store_front` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."store_front" DROP COLUMN "bannerImage",
DROP COLUMN "logoImage",
ADD COLUMN     "bannerImageBlurData" TEXT NOT NULL,
ADD COLUMN     "bannerImageUrl" TEXT NOT NULL,
ADD COLUMN     "logoImageBlurData" TEXT NOT NULL,
ADD COLUMN     "logoImageUrl" TEXT NOT NULL,
ADD COLUMN     "whatsappNumber" TEXT;
