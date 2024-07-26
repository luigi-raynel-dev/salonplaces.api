/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `birthday` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `genderId` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Customer` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `Professional` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Professional` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Professional` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Professional` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Professional` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the column `userName` on the `Staff` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Customer` DROP FOREIGN KEY `Customer_genderId_fkey`;

-- DropIndex
DROP INDEX `Customer_email_key` ON `Customer`;

-- DropIndex
DROP INDEX `Customer_phone_key` ON `Customer`;

-- DropIndex
DROP INDEX `Professional_email_key` ON `Professional`;

-- DropIndex
DROP INDEX `Professional_phone_key` ON `Professional`;

-- DropIndex
DROP INDEX `Staff_email_key` ON `Staff`;

-- DropIndex
DROP INDEX `Staff_userName_key` ON `Staff`;

-- AlterTable
ALTER TABLE `Customer` DROP COLUMN `avatarUrl`,
    DROP COLUMN `birthday`,
    DROP COLUMN `email`,
    DROP COLUMN `genderId`,
    DROP COLUMN `name`,
    DROP COLUMN `password`,
    DROP COLUMN `phone`;

-- AlterTable
ALTER TABLE `Professional` DROP COLUMN `avatarUrl`,
    DROP COLUMN `email`,
    DROP COLUMN `name`,
    DROP COLUMN `password`,
    DROP COLUMN `phone`;

-- AlterTable
ALTER TABLE `Staff` DROP COLUMN `avatarUrl`,
    DROP COLUMN `email`,
    DROP COLUMN `password`,
    DROP COLUMN `userName`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `avatarUrl` VARCHAR(191) NULL,
    `birthday` DATETIME(3) NULL,
    `phone` VARCHAR(191) NULL,
    `genderId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Staff_userId_key` ON `Staff`(`userId`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_genderId_fkey` FOREIGN KEY (`genderId`) REFERENCES `Gender`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Staff` ADD CONSTRAINT `Staff_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
