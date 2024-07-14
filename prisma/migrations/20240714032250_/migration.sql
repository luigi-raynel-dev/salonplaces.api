/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Currency` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `Currency` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Currency` ADD COLUMN `title` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Currency_title_key` ON `Currency`(`title`);
