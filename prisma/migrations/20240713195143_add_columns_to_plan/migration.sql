/*
  Warnings:

  - Added the required column `exclusive` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recommended` to the `Plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Plan` ADD COLUMN `exclusive` BOOLEAN NOT NULL,
    ADD COLUMN `level` INTEGER NOT NULL,
    ADD COLUMN `recommended` BOOLEAN NOT NULL;
