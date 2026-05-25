/*
  Warnings:

  - Added the required column `houseNo` to the `House` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mapLocation` to the `House` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `house` ADD COLUMN `houseNo` VARCHAR(191) NOT NULL,
    ADD COLUMN `imageUrl` VARCHAR(191) NULL,
    ADD COLUMN `mapLocation` VARCHAR(191) NOT NULL,
    ADD COLUMN `plotNo` VARCHAR(191) NULL,
    ADD COLUMN `roadNo` VARCHAR(191) NULL,
    ADD COLUMN `unionName` VARCHAR(191) NULL,
    MODIFY `address` VARCHAR(191) NULL;
