-- CreateTable
CREATE TABLE `CommunityReport` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `category` ENUM('ROAD', 'ELECTRICITY', 'WATER', 'GAS', 'SECURITY', 'SANITATION', 'OTHER') NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `adminNote` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `reportedById` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CommunityReport` ADD CONSTRAINT `CommunityReport_reportedById_fkey` FOREIGN KEY (`reportedById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
