/*
  Warnings:

  - You are about to drop the `PlanCountry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Invoices` DROP FOREIGN KEY `Invoices_planCountryId_fkey`;

-- DropForeignKey
ALTER TABLE `PlanCountry` DROP FOREIGN KEY `PlanCountry_planId_fkey`;

-- DropForeignKey
ALTER TABLE `Salon` DROP FOREIGN KEY `Salon_planCountryId_fkey`;

-- DropTable
DROP TABLE `PlanCountry`;

-- CreateTable
CREATE TABLE `CountryPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `planId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `countryCode` VARCHAR(191) NOT NULL,
    `languageCode` VARCHAR(191) NOT NULL,
    `customDescription` VARCHAR(191) NULL,
    `currency` VARCHAR(191) NOT NULL,
    `monthlyPrice` DOUBLE NOT NULL,
    `monthlyPromotionalPrice` DOUBLE NULL,
    `quaterlyPrice` DOUBLE NOT NULL,
    `quaterlyPromotionalPrice` DOUBLE NULL,
    `yearlyPrice` DOUBLE NOT NULL,
    `yearlyPromotionalPrice` DOUBLE NULL,
    `monthlyPricePerUser` DOUBLE NOT NULL,
    `quaterlyPricePerUser` DOUBLE NOT NULL,
    `yearlyPricePerUser` DOUBLE NOT NULL,
    `active` BOOLEAN NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `CountryPlan_name_key`(`name`),
    UNIQUE INDEX `CountryPlan_countryCode_key`(`countryCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CountryPlan` ADD CONSTRAINT `CountryPlan_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salon` ADD CONSTRAINT `Salon_planCountryId_fkey` FOREIGN KEY (`planCountryId`) REFERENCES `CountryPlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoices` ADD CONSTRAINT `Invoices_planCountryId_fkey` FOREIGN KEY (`planCountryId`) REFERENCES `CountryPlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
