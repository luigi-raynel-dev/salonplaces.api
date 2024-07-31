/*
  Warnings:

  - You are about to drop the column `planCountryId` on the `Invoices` table. All the data in the column will be lost.
  - You are about to drop the column `planCountryId` on the `Salon` table. All the data in the column will be lost.
  - Added the required column `countryPlanId` to the `Invoices` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Invoices` DROP FOREIGN KEY `Invoices_planCountryId_fkey`;

-- DropForeignKey
ALTER TABLE `Salon` DROP FOREIGN KEY `Salon_planCountryId_fkey`;

-- AlterTable
ALTER TABLE `Invoices` DROP COLUMN `planCountryId`,
    ADD COLUMN `countryPlanId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Salon` DROP COLUMN `planCountryId`,
    ADD COLUMN `countryPlanId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Salon` ADD CONSTRAINT `Salon_countryPlanId_fkey` FOREIGN KEY (`countryPlanId`) REFERENCES `CountryPlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoices` ADD CONSTRAINT `Invoices_countryPlanId_fkey` FOREIGN KEY (`countryPlanId`) REFERENCES `CountryPlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
