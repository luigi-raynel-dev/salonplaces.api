/*
  Warnings:

  - You are about to drop the column `countryCode` on the `CountryPlan` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `CountryPlan` table. All the data in the column will be lost.
  - You are about to drop the column `languageCode` on the `CountryPlan` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `CountryPlan` table. All the data in the column will be lost.
  - Added the required column `countryId` to the `CountryPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `CountryPlan_countryCode_key` ON `CountryPlan`;

-- DropIndex
DROP INDEX `CountryPlan_name_key` ON `CountryPlan`;

-- AlterTable
ALTER TABLE `CountryPlan` DROP COLUMN `countryCode`,
    DROP COLUMN `currency`,
    DROP COLUMN `languageCode`,
    DROP COLUMN `name`,
    ADD COLUMN `countryId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Salon` ADD COLUMN `quotaProfessionals` INTEGER NULL;

-- CreateTable
CREATE TABLE `Language` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `universalTitle` VARCHAR(191) NOT NULL,
    `isoCode` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Language_title_key`(`title`),
    UNIQUE INDEX `Language_universalTitle_key`(`universalTitle`),
    UNIQUE INDEX `Language_isoCode_key`(`isoCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Currency` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `symbol` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Currency_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Country` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `isoCode` VARCHAR(191) NOT NULL,
    `callingCode` VARCHAR(191) NOT NULL,
    `languageId` INTEGER NOT NULL,
    `currencyId` INTEGER NOT NULL,

    UNIQUE INDEX `Country_name_key`(`name`),
    UNIQUE INDEX `Country_isoCode_key`(`isoCode`),
    UNIQUE INDEX `Country_callingCode_key`(`callingCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Country` ADD CONSTRAINT `Country_languageId_fkey` FOREIGN KEY (`languageId`) REFERENCES `Language`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Country` ADD CONSTRAINT `Country_currencyId_fkey` FOREIGN KEY (`currencyId`) REFERENCES `Currency`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CountryPlan` ADD CONSTRAINT `CountryPlan_countryId_fkey` FOREIGN KEY (`countryId`) REFERENCES `Country`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
