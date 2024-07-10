/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type]` on the table `Frequency` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `Gateway` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Gateway` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Gender` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[zipCode,number]` on the table `Location` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userName]` on the table `Manager` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Manager` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `PaymentStatus` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `PaymentStatus` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title]` on the table `PaymentType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `PaymentType` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `PlanCountry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `PlanCountry` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Professional` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Professional` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Salon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cnpj]` on the table `Salon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `Salon` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[salonId,order]` on the table `SalonMedia` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[salonId,title]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Salon_cardIdForRecurrence_fkey` ON `Salon`;

-- AlterTable
ALTER TABLE `Plan` ADD COLUMN `maxLocations` INTEGER NULL;

-- AlterTable
ALTER TABLE `ProfessionalHasService` ADD COLUMN `commissionPercentage` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Customer_email_key` ON `Customer`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Customer_phone_key` ON `Customer`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `Frequency_type_key` ON `Frequency`(`type`);

-- CreateIndex
CREATE UNIQUE INDEX `Gateway_title_key` ON `Gateway`(`title`);

-- CreateIndex
CREATE UNIQUE INDEX `Gateway_name_key` ON `Gateway`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Gender_name_key` ON `Gender`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Location_zipCode_number_key` ON `Location`(`zipCode`, `number`);

-- CreateIndex
CREATE UNIQUE INDEX `Manager_userName_key` ON `Manager`(`userName`);

-- CreateIndex
CREATE UNIQUE INDEX `Manager_email_key` ON `Manager`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `PaymentStatus_title_key` ON `PaymentStatus`(`title`);

-- CreateIndex
CREATE UNIQUE INDEX `PaymentStatus_name_key` ON `PaymentStatus`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `PaymentType_title_key` ON `PaymentType`(`title`);

-- CreateIndex
CREATE UNIQUE INDEX `PaymentType_name_key` ON `PaymentType`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Plan_name_key` ON `Plan`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `PlanCountry_name_key` ON `PlanCountry`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `PlanCountry_code_key` ON `PlanCountry`(`code`);

-- CreateIndex
CREATE UNIQUE INDEX `Professional_email_key` ON `Professional`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `Professional_phone_key` ON `Professional`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `Salon_slug_key` ON `Salon`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Salon_cnpj_key` ON `Salon`(`cnpj`);

-- CreateIndex
CREATE UNIQUE INDEX `Salon_phone_key` ON `Salon`(`phone`);

-- CreateIndex
CREATE UNIQUE INDEX `SalonMedia_salonId_order_key` ON `SalonMedia`(`salonId`, `order`);

-- CreateIndex
CREATE UNIQUE INDEX `Service_salonId_title_key` ON `Service`(`salonId`, `title`);
