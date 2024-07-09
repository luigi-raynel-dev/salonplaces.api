-- CreateTable
CREATE TABLE `Manager` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `avatarUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Plan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `maxProfessionals` INTEGER NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `multipleLocations` BOOLEAN NOT NULL,
    `trialMonths` INTEGER NOT NULL,
    `pixDiscount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlanCountry` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `planId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `code` INTEGER NOT NULL,
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

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Card` (
    `id` VARCHAR(191) NOT NULL,
    `number` INTEGER NOT NULL,
    `expirationMonth` INTEGER NOT NULL,
    `expirationYear` INTEGER NOT NULL,
    `cvv` INTEGER NOT NULL,
    `debit` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Salon` (
    `id` VARCHAR(191) NOT NULL,
    `planCountryId` INTEGER NOT NULL,
    `cardIdForRecurrence` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NULL,
    `cpf` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `cancellationPolicy` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL,
    `percentageDiscount` INTEGER NOT NULL,
    `instagram` VARCHAR(191) NULL,
    `tiktok` VARCHAR(191) NULL,
    `facebook` VARCHAR(191) NULL,
    `block` BOOLEAN NOT NULL,
    `blockReason` VARCHAR(191) NULL,
    `recurrence` BOOLEAN NOT NULL,
    `planExpirationDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PlanCountry` ADD CONSTRAINT `PlanCountry_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `Plan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salon` ADD CONSTRAINT `Salon_planCountryId_fkey` FOREIGN KEY (`planCountryId`) REFERENCES `PlanCountry`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salon` ADD CONSTRAINT `Salon_cardIdForRecurrence_fkey` FOREIGN KEY (`cardIdForRecurrence`) REFERENCES `Card`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
