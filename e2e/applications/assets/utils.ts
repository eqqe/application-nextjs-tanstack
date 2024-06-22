import { getBaseUtils } from '@/e2e/utils';
import { fakeLease, fakeProperty, fakeTenancyInCommon } from '@/lib/demo/fake';
import { faker } from '@faker-js/faker';
import { Page, expect } from '@playwright/test';
import { Lease, Property, PropertyTenancy, PropertyTenancyInCommon, Person } from '@prisma/client';
import { PropertyTenancyCreateScalarSchema } from '@zenstackhq/runtime/zod/models';
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

        await page.getByText('Select Property...').click();
        await page.getByText(name).click();
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

    async function createPropertyTenancy({
        propertyTenancy,
    }: {
        propertyTenancy: z.infer<typeof PropertyTenancyCreateScalarSchema>;
    }) {
        await base.clickButton('Create Property Tenancy');

        await base.selectFromCombo<PropertyTenancy>('type', propertyTenancy.type);
        await base.getByLabel<PropertyTenancy>('name').fill(propertyTenancy.name);

        switch (propertyTenancy.type) {
            case 'InCommon': {
                const tenancyInCommon = fakeTenancyInCommon();

                await base.getByLabel<PropertyTenancyInCommon>('streetAddress').fill(tenancyInCommon.streetAddress);
                await base.getByLabel<PropertyTenancyInCommon>('city').fill(tenancyInCommon.city);
                await base.getByLabel<PropertyTenancyInCommon>('postalCode').fill(tenancyInCommon.postalCode);
                await base.getByLabel<PropertyTenancyInCommon>('country').fill(tenancyInCommon.country);
                await base
                    .getByLabel<PropertyTenancyInCommon>('intraCommunityVAT')
                    .fill(tenancyInCommon.intraCommunityVAT ?? '');
                await base.getByLabel<PropertyTenancyInCommon>('siren').fill(tenancyInCommon.siren ?? '');
                await base.getByLabel<PropertyTenancyInCommon>('siret').fill(tenancyInCommon.siret ?? '');
                break;
            }
            case 'ByEntirety': {
                await base.getByLabel<Person>('birthDate').fill('1990-12-12');
                await base.getByLabel<Person>('phone').fill('0607080901');
                break;
            }
            case 'Joint': {
                break;
            }
        }
        await base.clickSaveChanges();

        await base.checkToastCreated(propertyTenancy.name);
    }
    return {
        enable,
        openEssentialData,
        createProperty,
        createPropertyTenancy,
        createLease,
        createLeaseFindProperty,
    };
}
