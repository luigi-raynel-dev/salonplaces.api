-- AlterTable
ALTER TABLE `Salon` MODIFY `active` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `percentageDiscount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `block` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `recurrence` BOOLEAN NOT NULL DEFAULT false;
