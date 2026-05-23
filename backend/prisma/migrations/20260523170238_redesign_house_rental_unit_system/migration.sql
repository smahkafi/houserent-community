/*
  Warnings:

  - You are about to drop the column `houseId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `attachedBathrooms` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `availableFrom` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `balconies` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `bathrooms` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `bedrooms` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `commonBathrooms` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `floorNo` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `rentAmount` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `sizeInSqft` on the `house` table. All the data in the column will be lost.
  - You are about to drop the `rentalapplication` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `rentalUnitId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_houseId_fkey`;

-- DropForeignKey
ALTER TABLE `rentalapplication` DROP FOREIGN KEY `RentalApplication_houseId_fkey`;

-- DropForeignKey
ALTER TABLE `rentalapplication` DROP FOREIGN KEY `RentalApplication_tenantId_fkey`;

-- AlterTable
ALTER TABLE `booking` DROP COLUMN `houseId`,
    ADD COLUMN `rentalUnitId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `house` DROP COLUMN `attachedBathrooms`,
    DROP COLUMN `availableFrom`,
    DROP COLUMN `balconies`,
    DROP COLUMN `bathrooms`,
    DROP COLUMN `bedrooms`,
    DROP COLUMN `commonBathrooms`,
    DROP COLUMN `floorNo`,
    DROP COLUMN `rentAmount`,
    DROP COLUMN `sizeInSqft`,
    ADD COLUMN `deleteReason` VARCHAR(191) NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `deletedById` INTEGER NULL,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `restoreReason` VARCHAR(191) NULL,
    ADD COLUMN `restoreRequested` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `restoreRequestedAt` DATETIME(3) NULL,
    ADD COLUMN `restoreReviewNote` VARCHAR(191) NULL,
    ADD COLUMN `restoreReviewedAt` DATETIME(3) NULL,
    ADD COLUMN `restoreReviewedById` INTEGER NULL;

-- DropTable
DROP TABLE `rentalapplication`;

-- CreateTable
CREATE TABLE `RentalUnit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `rentAmount` DOUBLE NOT NULL,
    `bedrooms` INTEGER NOT NULL,
    `bathrooms` INTEGER NOT NULL,
    `attachedBathrooms` INTEGER NULL,
    `commonBathrooms` INTEGER NULL,
    `balconies` INTEGER NULL,
    `floorNo` INTEGER NULL,
    `sizeInSqft` DOUBLE NULL,
    `availableFrom` DATETIME(3) NULL,
    `isAvailable` BOOLEAN NOT NULL DEFAULT true,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `rejectionReason` VARCHAR(191) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `houseId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RentalUnit` ADD CONSTRAINT `RentalUnit_houseId_fkey` FOREIGN KEY (`houseId`) REFERENCES `House`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_rentalUnitId_fkey` FOREIGN KEY (`rentalUnitId`) REFERENCES `RentalUnit`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
