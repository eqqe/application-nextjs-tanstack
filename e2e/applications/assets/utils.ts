import { getBaseUtils } from '@/e2e/utils';
import { fakeLease, fakeProperty } from '@/lib/demo/fake';
import { Page, expect } from '@playwright/test';
import { Lease, Property, PropertyTenancy, propertyTenancyInCommon, Person } from '@prisma/client';
import {
    propertyJointTenancyCreateScalarSchema,
    propertyTenancyByEntiretyCreateScalarSchema,
    propertyTenancyInCommonCreateScalarSchema,
} from '@zenstackhq/runtime/zod/models';
import { z } from 'zod';

export function getAssetsUtils(base: ReturnType<typeof getBaseUtils>, page: Page) {
    async function enable() {
        await base.openSettings();
        await page.getByText('Enable Assets').click();
    }
    async function openEssentialData() {
        await page.getByText('Your essential data').click();
    }
    async function createFillScalarLeaseFields({ startDate }: { startDate: string }) {
        await base.clickButton('Create lease');

        const lease = fakeLease();
        await base.getByLabel<Lease>('startDate').fill(startDate);

        await base.selectFromCombo<Lease>('type', lease.type);
        await base.selectFromCombo<Lease>('duration', lease.duration);
        await base.getByLabel<Lease>('rentAmount').fill(lease.rentAmount.toString());
        await base.selectFromCombo<Lease>('periodicity', lease.periodicity);
        await base.selectFromCombo<Lease>('paymentType', lease.paymentType);
        await base.selectFromCombo<Lease>('paymentMode', lease.paymentMode);

        return lease.rentAmount;
    }

    async function createLease({ streetAddress, startDate }: { streetAddress: string; startDate: string }) {
        const rentAmount = await createFillScalarLeaseFields({ startDate });
        await base.clickSaveChanges();

        await expect(page.getByText(streetAddress)).toBeVisible();
        await expect(page.getByText(`Start Date: ${startDate}`)).toBeVisible();
        await expect(page.getByText(`$${rentAmount}`)).toBeVisible();
    }

    async function createLeaseFindProperty({ name, startDate }: { name: string; startDate: string }) {
        await createFillScalarLeaseFields({ startDate });
        await base.selectLine({ name });
        await base.clickSaveChanges();
    }

    async function createProperty({ property }: { property: Partial<Property> }) {
        await base.clickButton('Create Property');

        const propertyFake = fakeProperty();
        const streetAddress = property.streetAddress ?? propertyFake.streetAddress;
        await base.selectFromCombo<Property>('propertyType', property.propertyType ?? propertyFake.propertyType);

        await base.getByLabel<Property>('streetAddress').fill(streetAddress);
        await base.getByLabel<Property>('city').fill(property.city ?? propertyFake.city);
        await base.getByLabel<Property>('postalCode').fill(property.postalCode ?? propertyFake.postalCode);
        await base.getByLabel<Property>('country').fill(property.country ?? propertyFake.country);
        await base.getByLabel<Property>('state').fill(property.state ?? propertyFake.state ?? '');
        await base.getByLabel<Property>('name').fill(property.name ?? propertyFake.name);
        await base.getByLabel<Property>('surface').fill((property.surface ?? propertyFake.surface).toString());

        await base.getByLabel('private').check();
        await base.clickSaveChanges();

        await base.checkToastCreated('property');
        return streetAddress;
    }

    async function createpropertyTenancyInCommon({
        tenancyInCommon,
        propertyTenancyName,
        surface,
    }: {
        tenancyInCommon: z.infer<typeof propertyTenancyInCommonCreateScalarSchema>;
        propertyTenancyName: string;
        // Surface to identify property line in test
        surface: number;
    }) {
        await base.clickButton('Create propertyTenancyInCommon');

        await base.selectLine({ name: surface.toString() });

        await base.getByLabel<PropertyTenancy>('name').fill(propertyTenancyName);

        await base.getByLabel<propertyTenancyInCommon>('streetAddress').fill(tenancyInCommon.streetAddress);
        await base.getByLabel<propertyTenancyInCommon>('city').fill(tenancyInCommon.city);
        await base.getByLabel<propertyTenancyInCommon>('postalCode').fill(tenancyInCommon.postalCode);
        await base.getByLabel<propertyTenancyInCommon>('country').fill(tenancyInCommon.country);
        await base
            .getByLabel<propertyTenancyInCommon>('intraCommunityVAT')
            .fill(tenancyInCommon.intraCommunityVAT ?? '');
        await base.getByLabel<propertyTenancyInCommon>('siren').fill(tenancyInCommon.siren ?? '');
        await base.getByLabel<propertyTenancyInCommon>('siret').fill(tenancyInCommon.siret ?? '');
        await base.clickSaveChanges();
    }

    async function createPropertyTenancyJoint({
        jointTenancy,
        propertyTenancyName,
        surface,
    }: {
        jointTenancy: z.infer<typeof propertyJointTenancyCreateScalarSchema>;
        propertyTenancyName: string;
        // Surface to identify property line in test
        surface: number;
    }) {
        await base.clickButton('Create propertyJointTenancy');
        await base.selectLine({ name: surface.toString() });
        await base.getByLabel<PropertyTenancy>('name').fill(propertyTenancyName);
        await base.clickSaveChanges();
    }

    async function createpropertyTenancyByEntirety({
        byEntirety,
        propertyTenancyName,
        surface,
    }: {
        byEntirety: z.infer<typeof propertyTenancyByEntiretyCreateScalarSchema>;
        propertyTenancyName: string;
        // Surface to identify property line in test
        surface: number;
    }) {
        await base.clickButton('Create propertyTenancyByEntirety');
        await base.selectLine({ name: surface.toString() });
        await base.getByLabel<PropertyTenancy>('name').fill(propertyTenancyName);
        await base.getByLabel<Person>('birthDate').fill('1990-12-12');
        await base.getByLabel<Person>('phone').fill('0607080901');
        await base.clickSaveChanges();
    }
    return {
        enable,
        openEssentialData,
        createProperty,
        createpropertyTenancyInCommon,
        createPropertyTenancyJoint,
        createpropertyTenancyByEntirety,
        createLease,
        createLeaseFindProperty,
    };
}
