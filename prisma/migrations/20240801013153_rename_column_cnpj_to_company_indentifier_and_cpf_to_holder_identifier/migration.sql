/*
  Warnings:

  - You are about to drop the column `cnpj` on the `Salon` table. All the data in the column will be lost.
  - You are about to drop the column `cpf` on the `Salon` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[companyIdentifier]` on the table `Salon` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Salon_cnpj_key` ON `Salon`;

-- AlterTable
ALTER TABLE `Salon` DROP COLUMN `cnpj`,
    DROP COLUMN `cpf`,
    ADD COLUMN `companyIdentifier` VARCHAR(191) NULL,
    ADD COLUMN `holderIdentifier` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Salon_companyIdentifier_key` ON `Salon`(`companyIdentifier`);
