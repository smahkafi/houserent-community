-- CreateTable
CREATE TABLE `RentalApplication` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` INTEGER NOT NULL,
    `bookingId` INTEGER NOT NULL,
    `nidDocument` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NOT NULL,
    `additionalDocument` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `notes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RentalApplication_bookingId_key`(`bookingId`),
    INDEX `RentalApplication_tenantId_idx`(`tenantId`),
    INDEX `RentalApplication_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RentalApplication` ADD CONSTRAINT `RentalApplication_tenantId_fkey` FOREIGN KEY (`tenantId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalApplication` ADD CONSTRAINT `RentalApplication_bookingId_fkey` FOREIGN KEY (`bookingId`) REFERENCES `Booking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
