/*
  Warnings:

  - You are about to drop the column `trialMonths` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Plan` DROP COLUMN `trialMonths`,
    ADD COLUMN `daysTrial` INTEGER NULL;
