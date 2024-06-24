import { getBaseUtils } from '@/e2e/utils';
import { fakeLease, fakeProperty, fakeTenancyInCommon } from '@/lib/demo/fake';
import { PropertyTenancyInCommonCreateForm } from '@/zmodel/lib/forms/property-tenancy-in-common';
import { useCreatePropertyTenancy } from '@/zmodel/lib/hooks';
import { Page, expect } from '@playwright/test';
import { Lease, Property, PropertyTenancy, PropertyTenancyInCommon, Person } from '@prisma/client';
import { PropertyJointTenancy } from '@zenstackhq/runtime/models';
import {
    PropertyJointTenancyCreateScalarSchema,
    PropertyTenancyByEntiretyCreateScalarSchema,
    PropertyTenancyInCommonCreateScalarSchema,
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
        await base.clickButton('Create Lease');

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

        await base.checkToastCreated('Property');
        return streetAddress;
    }

    async function createPropertyTenancyInCommon({
        tenancyInCommon,
        propertyTenancyName,
        surface,
    }: {
        tenancyInCommon: z.infer<typeof PropertyTenancyInCommonCreateScalarSchema>;
        propertyTenancyName: string;
        // Surface to identify property line in test
        surface: number;
    }) {
        await base.clickButton('Create PropertyTenancyInCommon');

        await base.selectLine({ name: surface.toString() });

        await base.getByLabel<PropertyTenancy>('name').fill(propertyTenancyName);

        await base.getByLabel<PropertyTenancyInCommon>('streetAddress').fill(tenancyInCommon.streetAddress);
        await base.getByLabel<PropertyTenancyInCommon>('city').fill(tenancyInCommon.city);
        await base.getByLabel<PropertyTenancyInCommon>('postalCode').fill(tenancyInCommon.postalCode);
        await base.getByLabel<PropertyTenancyInCommon>('country').fill(tenancyInCommon.country);
        await base
            .getByLabel<PropertyTenancyInCommon>('intraCommunityVAT')
            .fill(tenancyInCommon.intraCommunityVAT ?? '');
        await base.getByLabel<PropertyTenancyInCommon>('siren').fill(tenancyInCommon.siren ?? '');
        await base.getByLabel<PropertyTenancyInCommon>('siret').fill(tenancyInCommon.siret ?? '');
        await base.clickSaveChanges();
    }

    async function createPropertyTenancyJoint({
        jointTenancy,
        propertyTenancyName,
        surface,
    }: {
        jointTenancy: z.infer<typeof PropertyJointTenancyCreateScalarSchema>;
        propertyTenancyName: string;
        // Surface to identify property line in test
        surface: number;
    }) {
        await base.clickButton('Create PropertyJointTenancy');
        await base.selectLine({ name: surface.toString() });
        await base.getByLabel<PropertyTenancy>('name').fill(propertyTenancyName);
        await base.clickSaveChanges();
    }

    async function createPropertyTenancyByEntirety({
        byEntirety,
        propertyTenancyName,
        surface,
    }: {
        byEntirety: z.infer<typeof PropertyTenancyByEntiretyCreateScalarSchema>;
        propertyTenancyName: string;
        // Surface to identify property line in test
        surface: number;
    }) {
        await base.clickButton('Create PropertyTenancyByEntirety');
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
        createPropertyTenancyInCommon,
        createPropertyTenancyJoint,
        createPropertyTenancyByEntirety,
        createLease,
        createLeaseFindProperty,
    };
}
