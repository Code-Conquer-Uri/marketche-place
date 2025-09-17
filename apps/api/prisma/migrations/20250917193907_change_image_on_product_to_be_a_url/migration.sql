/*
  Warnings:

  - You are about to drop the column `image` on the `product` table. All the data in the column will be lost.
  - Added the required column `imageBlurData` to the `product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."product" DROP COLUMN "image",
ADD COLUMN     "imageBlurData" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL;
