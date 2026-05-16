/*
  Warnings:

  - Made the column `description` on table `house` required. This step will fail if there are existing NULL values in that column.
  - Made the column `area` on table `house` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bedrooms` on table `house` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bathrooms` on table `house` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `house` ADD COLUMN `deleteReason` TEXT NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `deletedById` INTEGER NULL,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `restoreReason` TEXT NULL,
    ADD COLUMN `restoreRequested` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `restoreRequestedAt` DATETIME(3) NULL,
    ADD COLUMN `restoreReviewNote` TEXT NULL,
    ADD COLUMN `restoreReviewedAt` DATETIME(3) NULL,
    ADD COLUMN `restoreReviewedById` INTEGER NULL,
    MODIFY `description` TEXT NOT NULL,
    MODIFY `area` VARCHAR(191) NOT NULL,
    MODIFY `bedrooms` INTEGER NOT NULL,
    MODIFY `bathrooms` INTEGER NOT NULL,
    MODIFY `rejectionReason` TEXT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `password` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `House_status_idx` ON `House`(`status`);

-- CreateIndex
CREATE INDEX `House_isPublished_idx` ON `House`(`isPublished`);

-- CreateIndex
CREATE INDEX `House_isDeleted_idx` ON `House`(`isDeleted`);

-- CreateIndex
CREATE INDEX `House_restoreRequested_idx` ON `House`(`restoreRequested`);

-- CreateIndex
CREATE INDEX `House_deletedById_idx` ON `House`(`deletedById`);

-- CreateIndex
CREATE INDEX `House_restoreReviewedById_idx` ON `House`(`restoreReviewedById`);

-- AddForeignKey
ALTER TABLE `House` ADD CONSTRAINT `House_deletedById_fkey` FOREIGN KEY (`deletedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `House` ADD CONSTRAINT `House_restoreReviewedById_fkey` FOREIGN KEY (`restoreReviewedById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `house` RENAME INDEX `House_landlordId_fkey` TO `House_landlordId_idx`;
