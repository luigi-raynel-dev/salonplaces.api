/*
  Warnings:

  - A unique constraint covering the columns `[universalName]` on the table `Country` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `universalName` to the `Country` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Country` ADD COLUMN `universalName` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Country_universalName_key` ON `Country`(`universalName`);
