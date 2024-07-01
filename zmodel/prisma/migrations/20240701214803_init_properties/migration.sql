-- CreateEnum
CREATE TYPE "ProfileRole" AS ENUM ('USER', 'ADMIN', 'GUEST');

-- CreateEnum
CREATE TYPE "Type" AS ENUM ('subTabFolder', 'grid', 'property', 'lease', 'payment', 'leaseTenant', 'charge', 'person', 'user', 'profile', 'propertyTenancy', 'propertyTenancyInCommon', 'propertyTenancyInCommonTenant', 'propertyJointTenancy', 'propertyTenancyByEntirety', 'corporation', 'profileUser', 'space', 'spaceApplicationVersion', 'folderApplicationVersion', 'applicationVersion', 'gridCardTable', 'tabFolder', 'gridCardFooter', 'gridCard', 'gridCardFooterButton', 'gridCardFooterProgress', 'chart', 'groupBy', 'gridElement', 'gridTabContent', 'gridTabs', 'leaseMailOtherAddress', 'propertyJointTenancyTenant', 'application');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('APARTMENT', 'HOUSE', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "PropertyTenancyType" AS ENUM ('propertyTenancyInCommon', 'propertyJointTenancy', 'propertyTenancyByEntirety');

-- CreateEnum
CREATE TYPE "ChargeType" AS ENUM ('MAINTENANCE', 'UTILITIES', 'TAXES', 'OTHER');

-- CreateEnum
CREATE TYPE "LeaseType" AS ENUM ('Protected', 'Commercial', 'Furnished', 'Professional', 'Seasonal', 'OtherLease');

-- CreateEnum
CREATE TYPE "LeaseDurationType" AS ENUM ('OneYear', 'TwoYears', 'ThreeYears', 'SixYears', 'NineYears', 'OtherDuration');

-- CreateEnum
CREATE TYPE "LeasePeriodicityType" AS ENUM ('Monthly', 'Quarterly', 'Yearly', 'OtherPeriodicity');

-- CreateEnum
CREATE TYPE "LeaseQuaterlyPeriodicityType" AS ENUM ('JanuaryAprilJulyOctober', 'FebruaryMayAugustNovember', 'MarchJuneSeptemberDecember');

-- CreateEnum
CREATE TYPE "LeasePaymentType" AS ENUM ('Advance', 'Arrears');

-- CreateEnum
CREATE TYPE "LeasePaymentMode" AS ENUM ('Cheque', 'WireTransfer', 'DirectDebit', 'Card', 'OtherPayment', 'Cash');

-- CreateEnum
CREATE TYPE "LeaseTenantType" AS ENUM ('Corporation', 'Person');

-- CreateEnum
CREATE TYPE "GridElementType" AS ENUM ('Card', 'Tabs');

-- CreateEnum
CREATE TYPE "IconName" AS ENUM ('FolderKey', 'SquareUser', 'User', 'Users', 'Home', 'Gauge');

-- CreateEnum
CREATE TYPE "TypeTableRequest" AS ENUM ('findMany', 'groupBy', 'aggregate');

-- CreateEnum
CREATE TYPE "ChartType" AS ENUM ('BarChart', 'PieChart');

-- CreateTable
CREATE TABLE "Profile" (
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "ProfileRole" NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileUser" (
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ProfileUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT,
    "name" TEXT,
    "createSpaceId" TEXT,
    "selectedSpaces" TEXT[],
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "refresh_token_expires_in" INTEGER,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("identifier","token")
);

-- CreateTable
CREATE TABLE "SpaceApplicationVersion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "spaceId" TEXT NOT NULL,
    "applicationVersionId" TEXT NOT NULL,

    CONSTRAINT "SpaceApplicationVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApplicationVersion" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "applicationSlug" TEXT NOT NULL,
    "versionMajor" INTEGER NOT NULL,
    "versionMinor" INTEGER NOT NULL,

    CONSTRAINT "ApplicationVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FolderApplicationVersion" (
    "index" INTEGER NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "applicationVersionId" TEXT NOT NULL,
    "path" TEXT NOT NULL,

    CONSTRAINT "FolderApplicationVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TabFolder" (
    "index" INTEGER NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "folderId" TEXT NOT NULL,

    CONSTRAINT "TabFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubTabFolder" (
    "index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tabId" TEXT NOT NULL,

    CONSTRAINT "SubTabFolder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Space" (
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "spaceId" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL DEFAULT false,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT,
    "propertyType" "PropertyType" NOT NULL,
    "surface" INTEGER NOT NULL,
    "tenancyId" TEXT,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyTenancy" (
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PropertyTenancyType" NOT NULL,
    "tenancyInCommonId" TEXT,
    "jointTenancyId" TEXT,
    "tenancyByEntiretyId" TEXT,

    CONSTRAINT "PropertyTenancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Charge" (
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT NOT NULL,
    "leaseId" TEXT,
    "chargeType" "ChargeType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "Charge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyTenancyInCommon" (
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT,
    "siret" TEXT,
    "siren" TEXT,
    "codeNafApe" TEXT,
    "rcs" TEXT,
    "lei" TEXT,
    "intraCommunityVAT" TEXT,

    CONSTRAINT "PropertyTenancyInCommon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyJointTenancy" (
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyJointTenancy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyTenancyByEntirety" (
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "personId" TEXT NOT NULL,

    CONSTRAINT "PropertyTenancyByEntirety_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyTenancyInCommonTenant" (
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "personId" TEXT NOT NULL,
    "propertyTenancyInCommonId" TEXT NOT NULL,
    "entryDate" TIMESTAMP(3) NOT NULL,
    "exitDate" TIMESTAMP(3),

    CONSTRAINT "PropertyTenancyInCommonTenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyJointTenancyTenant" (
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "personId" TEXT NOT NULL,
    "propertyJointTenancyId" TEXT NOT NULL,

    CONSTRAINT "PropertyJointTenancyTenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "userId" TEXT,
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "phone" TEXT,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lease" (
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "propertyId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "type" "LeaseType" NOT NULL,
    "duration" "LeaseDurationType" NOT NULL,
    "rentAmount" INTEGER NOT NULL,
    "periodicity" "LeasePeriodicityType" NOT NULL,
    "quaterlyPeriodicity" "LeaseQuaterlyPeriodicityType",
    "paymentType" "LeasePaymentType" NOT NULL,
    "paymentMode" "LeasePaymentMode" NOT NULL,
    "iban" TEXT,
    "notes" TEXT,

    CONSTRAINT "Lease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaseTenant" (
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "leaseId" TEXT NOT NULL,
    "tenantType" "LeaseTenantType" NOT NULL,
    "personId" TEXT,
    "corporationId" TEXT,

    CONSTRAINT "LeaseTenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Corporation" (
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT,
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Corporation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "leaseId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeaseMailOtherAddress" (
    "streetAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT,
    "ownerId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "leaseId" TEXT NOT NULL,

    CONSTRAINT "LeaseMailOtherAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grid" (
    "index" INTEGER NOT NULL,
    "icon" "IconName",
    "name" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "Grid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GridElement" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "index" INTEGER NOT NULL,
    "parentId" TEXT,
    "gridTabContentId" TEXT,
    "type" "GridElementType" NOT NULL,
    "colSpan" INTEGER DEFAULT 4,

    CONSTRAINT "GridElement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GridCard" (
    "icon" "IconName",
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleXl" INTEGER,
    "description" TEXT NOT NULL,
    "invertTitleDescription" BOOLEAN NOT NULL DEFAULT false,
    "headerPb" INTEGER NOT NULL DEFAULT 2,
    "content" TEXT,
    "count" "Type",

    CONSTRAINT "GridCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GridTabs" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "GridTabs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GridTabContent" (
    "index" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "GridTabContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GridCardFooter" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "GridCardFooter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GridCardFooterButton" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "table" "Type" NOT NULL,

    CONSTRAINT "GridCardFooterButton_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GridCardFooterProgress" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,

    CONSTRAINT "GridCardFooterProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GridCardTable" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT NOT NULL,
    "type" "Type" NOT NULL,
    "typeTableRequest" "TypeTableRequest" NOT NULL,
    "columns" TEXT[],

    CONSTRAINT "GridCardTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupBy" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT NOT NULL,
    "fields" TEXT[],
    "sum" TEXT[],
    "count" TEXT[],
    "avg" TEXT[],
    "min" TEXT[],
    "max" TEXT[],
    "orderBy" TEXT,

    CONSTRAINT "GroupBy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chart" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "parentId" TEXT NOT NULL,
    "type" "ChartType" NOT NULL,

    CONSTRAINT "Chart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProfileToSpace" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CorporationToPerson" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceApplicationVersion_spaceId_applicationVersionId_key" ON "SpaceApplicationVersion"("spaceId", "applicationVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_slug_key" ON "Application"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationVersion_applicationSlug_versionMinor_versionMajo_key" ON "ApplicationVersion"("applicationSlug", "versionMinor", "versionMajor");

-- CreateIndex
CREATE UNIQUE INDEX "Space_name_ownerId_key" ON "Space"("name", "ownerId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyTenancy_tenancyInCommonId_key" ON "PropertyTenancy"("tenancyInCommonId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyTenancy_jointTenancyId_key" ON "PropertyTenancy"("jointTenancyId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyTenancy_tenancyByEntiretyId_key" ON "PropertyTenancy"("tenancyByEntiretyId");

-- CreateIndex
CREATE UNIQUE INDEX "GridCard_parentId_key" ON "GridCard"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "GridTabs_parentId_key" ON "GridTabs"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "GridCardFooter_parentId_key" ON "GridCardFooter"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "GridCardFooterButton_parentId_key" ON "GridCardFooterButton"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "GridCardFooterProgress_parentId_key" ON "GridCardFooterProgress"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "GridCardTable_parentId_key" ON "GridCardTable"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupBy_parentId_key" ON "GroupBy"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Chart_parentId_key" ON "Chart"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "_ProfileToSpace_AB_unique" ON "_ProfileToSpace"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfileToSpace_B_index" ON "_ProfileToSpace"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CorporationToPerson_AB_unique" ON "_CorporationToPerson"("A", "B");

-- CreateIndex
CREATE INDEX "_CorporationToPerson_B_index" ON "_CorporationToPerson"("B");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileUser" ADD CONSTRAINT "ProfileUser_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileUser" ADD CONSTRAINT "ProfileUser_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileUser" ADD CONSTRAINT "ProfileUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceApplicationVersion" ADD CONSTRAINT "SpaceApplicationVersion_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceApplicationVersion" ADD CONSTRAINT "SpaceApplicationVersion_applicationVersionId_fkey" FOREIGN KEY ("applicationVersionId") REFERENCES "ApplicationVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApplicationVersion" ADD CONSTRAINT "ApplicationVersion_applicationSlug_fkey" FOREIGN KEY ("applicationSlug") REFERENCES "Application"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FolderApplicationVersion" ADD CONSTRAINT "FolderApplicationVersion_applicationVersionId_fkey" FOREIGN KEY ("applicationVersionId") REFERENCES "ApplicationVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TabFolder" ADD CONSTRAINT "TabFolder_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "FolderApplicationVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubTabFolder" ADD CONSTRAINT "SubTabFolder_tabId_fkey" FOREIGN KEY ("tabId") REFERENCES "TabFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Space" ADD CONSTRAINT "Space_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_tenancyId_fkey" FOREIGN KEY ("tenancyId") REFERENCES "PropertyTenancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTenancy" ADD CONSTRAINT "PropertyTenancy_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTenancy" ADD CONSTRAINT "PropertyTenancy_tenancyInCommonId_fkey" FOREIGN KEY ("tenancyInCommonId") REFERENCES "PropertyTenancyInCommon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTenancy" ADD CONSTRAINT "PropertyTenancy_jointTenancyId_fkey" FOREIGN KEY ("jointTenancyId") REFERENCES "PropertyJointTenancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTenancy" ADD CONSTRAINT "PropertyTenancy_tenancyByEntiretyId_fkey" FOREIGN KEY ("tenancyByEntiretyId") REFERENCES "PropertyTenancyByEntirety"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTenancyInCommon" ADD CONSTRAINT "PropertyTenancyInCommon_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyJointTenancy" ADD CONSTRAINT "PropertyJointTenancy_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTenancyByEntirety" ADD CONSTRAINT "PropertyTenancyByEntirety_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTenancyByEntirety" ADD CONSTRAINT "PropertyTenancyByEntirety_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTenancyInCommonTenant" ADD CONSTRAINT "PropertyTenancyInCommonTenant_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTenancyInCommonTenant" ADD CONSTRAINT "PropertyTenancyInCommonTenant_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyTenancyInCommonTenant" ADD CONSTRAINT "PropertyTenancyInCommonTenant_propertyTenancyInCommonId_fkey" FOREIGN KEY ("propertyTenancyInCommonId") REFERENCES "PropertyTenancyInCommon"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyJointTenancyTenant" ADD CONSTRAINT "PropertyJointTenancyTenant_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyJointTenancyTenant" ADD CONSTRAINT "PropertyJointTenancyTenant_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyJointTenancyTenant" ADD CONSTRAINT "PropertyJointTenancyTenant_propertyJointTenancyId_fkey" FOREIGN KEY ("propertyJointTenancyId") REFERENCES "PropertyJointTenancy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Person" ADD CONSTRAINT "Person_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaseTenant" ADD CONSTRAINT "LeaseTenant_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaseTenant" ADD CONSTRAINT "LeaseTenant_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaseTenant" ADD CONSTRAINT "LeaseTenant_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaseTenant" ADD CONSTRAINT "LeaseTenant_corporationId_fkey" FOREIGN KEY ("corporationId") REFERENCES "Corporation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Corporation" ADD CONSTRAINT "Corporation_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaseMailOtherAddress" ADD CONSTRAINT "LeaseMailOtherAddress_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaseMailOtherAddress" ADD CONSTRAINT "LeaseMailOtherAddress_leaseId_fkey" FOREIGN KEY ("leaseId") REFERENCES "Lease"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grid" ADD CONSTRAINT "Grid_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SubTabFolder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridElement" ADD CONSTRAINT "GridElement_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Grid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridElement" ADD CONSTRAINT "GridElement_gridTabContentId_fkey" FOREIGN KEY ("gridTabContentId") REFERENCES "GridTabContent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridCard" ADD CONSTRAINT "GridCard_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GridElement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridTabs" ADD CONSTRAINT "GridTabs_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GridElement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridTabContent" ADD CONSTRAINT "GridTabContent_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GridTabs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridCardFooter" ADD CONSTRAINT "GridCardFooter_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GridCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridCardFooterButton" ADD CONSTRAINT "GridCardFooterButton_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GridCardFooter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridCardFooterProgress" ADD CONSTRAINT "GridCardFooterProgress_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GridCardFooter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GridCardTable" ADD CONSTRAINT "GridCardTable_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GridCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupBy" ADD CONSTRAINT "GroupBy_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GridCardTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chart" ADD CONSTRAINT "Chart_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "GridCardTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToSpace" ADD CONSTRAINT "_ProfileToSpace_A_fkey" FOREIGN KEY ("A") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileToSpace" ADD CONSTRAINT "_ProfileToSpace_B_fkey" FOREIGN KEY ("B") REFERENCES "Space"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CorporationToPerson" ADD CONSTRAINT "_CorporationToPerson_A_fkey" FOREIGN KEY ("A") REFERENCES "Corporation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CorporationToPerson" ADD CONSTRAINT "_CorporationToPerson_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
