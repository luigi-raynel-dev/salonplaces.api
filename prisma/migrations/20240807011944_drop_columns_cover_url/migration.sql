/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `coverUrl` on the `Salon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Location` DROP COLUMN `coverUrl`;

-- AlterTable
ALTER TABLE `Salon` DROP COLUMN `coverUrl`;
