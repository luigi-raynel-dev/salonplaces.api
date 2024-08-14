/*
  Warnings:

  - You are about to drop the `Scheduling` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Scheduling` DROP FOREIGN KEY `Scheduling_customerId_fkey`;

-- DropForeignKey
ALTER TABLE `Scheduling` DROP FOREIGN KEY `Scheduling_locationId_fkey`;

-- DropForeignKey
ALTER TABLE `Scheduling` DROP FOREIGN KEY `Scheduling_professionalId_fkey`;

-- DropForeignKey
ALTER TABLE `Scheduling` DROP FOREIGN KEY `Scheduling_serviceId_fkey`;

-- DropTable
DROP TABLE `Scheduling`;

-- CreateTable
CREATE TABLE `Booking` (
    `id` VARCHAR(191) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `locationId` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,
    `professionalId` VARCHAR(191) NOT NULL,
    `datetime` DATETIME(3) NOT NULL,
    `observation` VARCHAR(191) NULL,
    `canceled` BOOLEAN NOT NULL,
    `customizedPrice` DOUBLE NULL,
    `rating` INTEGER NOT NULL,
    `ratingReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `Customer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_professionalId_fkey` FOREIGN KEY (`professionalId`) REFERENCES `Professional`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
