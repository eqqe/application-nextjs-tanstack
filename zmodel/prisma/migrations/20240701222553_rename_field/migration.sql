/*
  Warnings:

  - You are about to drop the column `codeNafApe` on the `PropertyTenancyInCommon` table. All the data in the column will be lost.
  - You are about to drop the column `optionalCode` on the `PropertyTenancyInCommon` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PropertyTenancyInCommon" DROP COLUMN "codeNafApe",
DROP COLUMN "optionalCode",
ADD COLUMN     "nafApeCode" TEXT;
