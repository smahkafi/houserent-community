/*
  Warnings:

  - The values [CANCELLED] on the enum `Booking_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `deleteReason` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `deletedById` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `restoreReason` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `restoreRequested` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `restoreRequestedAt` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `restoreReviewNote` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `restoreReviewedAt` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `restoreReviewedById` on the `house` table. All the data in the column will be lost.
  - You are about to drop the column `agreementNumber` on the `rentalagreement` table. All the data in the column will be lost.
  - You are about to drop the column `applicationId` on the `rentalagreement` table. All the data in the column will be lost.
  - You are about to drop the column `houseId` on the `rentalagreement` table. All the data in the column will be lost.
  - You are about to drop the column `landlordId` on the `rentalagreement` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyRent` on the `rentalagreement` table. All the data in the column will be lost.
  - You are about to drop the column `securityDeposit` on the `rentalagreement` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `rentalagreement` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `rentalagreement` table. All the data in the column will be lost.
  - You are about to drop the column `tenantId` on the `rentalagreement` table. All the data in the column will be lost.
  - You are about to drop the column `additionalDocument` on the `rentalapplication` table. All the data in the column will be lost.
  - You are about to drop the column `bookingId` on the `rentalapplication` table. All the data in the column will be lost.
  - You are about to drop the column `nidDocument` on the `rentalapplication` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `rentalapplication` table. All the data in the column will be lost.
  - You are about to drop the column `photo` on the `rentalapplication` table. All the data in the column will be lost.
  - You are about to drop the `rentalagreementfile` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `message` on table `booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `moveInDate` on table `booking` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `pdfUrl` to the `RentalAgreement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseId` to the `RentalApplication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_houseId_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_landlordId_fkey`;

-- DropForeignKey
ALTER TABLE `booking` DROP FOREIGN KEY `Booking_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `house` DROP FOREIGN KEY `House_deletedById_fkey`;

-- DropForeignKey
ALTER TABLE `house` DROP FOREIGN KEY `House_landlordId_fkey`;

-- DropForeignKey
ALTER TABLE `house` DROP FOREIGN KEY `House_restoreReviewedById_fkey`;

-- DropForeignKey
ALTER TABLE `rentalagreement` DROP FOREIGN KEY `RentalAgreement_applicationId_fkey`;

-- DropForeignKey
ALTER TABLE `rentalagreement` DROP FOREIGN KEY `RentalAgreement_bookingId_fkey`;

-- DropForeignKey
ALTER TABLE `rentalagreement` DROP FOREIGN KEY `RentalAgreement_houseId_fkey`;

-- DropForeignKey
ALTER TABLE `rentalagreement` DROP FOREIGN KEY `RentalAgreement_landlordId_fkey`;

-- DropForeignKey
ALTER TABLE `rentalagreement` DROP FOREIGN KEY `RentalAgreement_tenantId_fkey`;

-- DropForeignKey
ALTER TABLE `rentalagreementfile` DROP FOREIGN KEY `RentalAgreementFile_rentalAgreementId_fkey`;

-- DropForeignKey
ALTER TABLE `rentalapplication` DROP FOREIGN KEY `RentalApplication_bookingId_fkey`;

-- DropForeignKey
ALTER TABLE `rentalapplication` DROP FOREIGN KEY `RentalApplication_tenantId_fkey`;

-- DropIndex
DROP INDEX `Booking_status_idx` ON `booking`;

-- DropIndex
DROP INDEX `House_isDeleted_idx` ON `house`;

-- DropIndex
DROP INDEX `House_isPublished_idx` ON `house`;

-- DropIndex
DROP INDEX `House_restoreRequested_idx` ON `house`;

-- DropIndex
DROP INDEX `House_status_idx` ON `house`;

-- DropIndex
DROP INDEX `RentalAgreement_agreementNumber_key` ON `rentalagreement`;

-- DropIndex
DROP INDEX `RentalAgreement_applicationId_key` ON `rentalagreement`;

-- DropIndex
DROP INDEX `RentalAgreement_status_idx` ON `rentalagreement`;

-- DropIndex
DROP INDEX `RentalApplication_bookingId_key` ON `rentalapplication`;

-- DropIndex
DROP INDEX `RentalApplication_status_idx` ON `rentalapplication`;

-- AlterTable
ALTER TABLE `booking` MODIFY `message` VARCHAR(191) NOT NULL,
    MODIFY `moveInDate` DATETIME(3) NOT NULL,
    MODIFY `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    MODIFY `rejectionReason` VARCHAR(191) NULL,
    MODIFY `landlordNote` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `house` DROP COLUMN `deleteReason`,
    DROP COLUMN `deletedAt`,
    DROP COLUMN `deletedById`,
    DROP COLUMN `isDeleted`,
    DROP COLUMN `restoreReason`,
    DROP COLUMN `restoreRequested`,
    DROP COLUMN `restoreRequestedAt`,
    DROP COLUMN `restoreReviewNote`,
    DROP COLUMN `restoreReviewedAt`,
    DROP COLUMN `restoreReviewedById`,
    MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `rejectionReason` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `rentalagreement` DROP COLUMN `agreementNumber`,
    DROP COLUMN `applicationId`,
    DROP COLUMN `houseId`,
    DROP COLUMN `landlordId`,
    DROP COLUMN `monthlyRent`,
    DROP COLUMN `securityDeposit`,
    DROP COLUMN `startDate`,
    DROP COLUMN `status`,
    DROP COLUMN `tenantId`,
    ADD COLUMN `pdfUrl` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `rentalapplication` DROP COLUMN `additionalDocument`,
    DROP COLUMN `bookingId`,
    DROP COLUMN `nidDocument`,
    DROP COLUMN `notes`,
    DROP COLUMN `photo`,
    ADD COLUMN `houseId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('TENANT', 'LANDLORD', 'RESIDENT', 'ADMIN', 'SUPER_ADMIN') NOT NULL DEFAULT 'TENANT';

-- DropTable
DROP TABLE `rentalagreementfile`;

-- CreateTable
CREATE TABLE `AppSetting` (
    `id` INTEGER NOT NULL DEFAULT 1,
    `agreementFooterEnabled` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `House` ADD CONSTRAINT `House_landlordId_fkey` FOREIGN KEY (`landlordId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_landlordId_fkey` FOREIGN KEY (`landlordId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Booking` ADD CONSTRAINT `Booking_houseId_fkey` FOREIGN KEY (`houseId`) REFERENCES `House`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalApplication` ADD CONSTRAINT `RentalApplication_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalApplication` ADD CONSTRAINT `RentalApplication_houseId_fkey` FOREIGN KEY (`houseId`) REFERENCES `House`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalAgreement` ADD CONSTRAINT `RentalAgreement_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
