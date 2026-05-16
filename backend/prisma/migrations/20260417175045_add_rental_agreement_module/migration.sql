-- CreateTable
CREATE TABLE `RentalAgreement` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bookingId` INTEGER NOT NULL,
    `applicationId` INTEGER NOT NULL,
    `tenantId` INTEGER NOT NULL,
    `landlordId` INTEGER NOT NULL,
    `houseId` INTEGER NOT NULL,
    `agreementNumber` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NULL,
    `monthlyRent` DOUBLE NOT NULL,
    `securityDeposit` DOUBLE NOT NULL DEFAULT 0,
    `status` ENUM('ACTIVE', 'TERMINATED', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RentalAgreement_bookingId_key`(`bookingId`),
    UNIQUE INDEX `RentalAgreement_applicationId_key`(`applicationId`),
    UNIQUE INDEX `RentalAgreement_agreementNumber_key`(`agreementNumber`),
    INDEX `RentalAgreement_tenantId_idx`(`tenantId`),
    INDEX `RentalAgreement_landlordId_idx`(`landlordId`),
    INDEX `RentalAgreement_houseId_idx`(`houseId`),
    INDEX `RentalAgreement_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RentalAgreementFile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rentalAgreementId` INTEGER NOT NULL,
    `format` ENUM('STAMP_3_PAGE', 'SINGLE_PAGE') NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `originalFileName` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `RentalAgreementFile_format_idx`(`format`),
    UNIQUE INDEX `RentalAgreementFile_rentalAgreementId_format_key`(`rentalAgreementId`, `format`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RentalAgreement` ADD CONSTRAINT `RentalAgreement_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalAgreement` ADD CONSTRAINT `RentalAgreement_applicationId_fkey` FOREIGN KEY (`applicationId`) REFERENCES `RentalApplication`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalAgreement` ADD CONSTRAINT `RentalAgreement_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalAgreement` ADD CONSTRAINT `RentalAgreement_landlordId_fkey` FOREIGN KEY (`landlordId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalAgreement` ADD CONSTRAINT `RentalAgreement_houseId_fkey` FOREIGN KEY (`houseId`) REFERENCES `House`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalAgreementFile` ADD CONSTRAINT `RentalAgreementFile_rentalAgreementId_fkey` FOREIGN KEY (`rentalAgreementId`) REFERENCES `RentalAgreement`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
