import { FieldPath, FieldValues } from 'react-hook-form';
import { beautifyObjectName } from '@/components/ui/auto-form/utils';
import { faker } from '@faker-js/faker';
import { Lease, Person, PropertyTenancy, PropertyTenancyInCommon, Space } from '@zenstackhq/runtime/models';
import { expect, Page, test as base } from '@playwright/test';
import { Property } from '@prisma/client';
import { fakeProperty, fakeTenancyInCommon } from '@/lib/demo/fake';
import { PropertyTenancyCreateScalarSchema } from '@zenstackhq/runtime/zod/models';
import { z } from 'zod';
import { getAssetsUtils } from '@/e2e/applications/assets/utils';

export const test = base.extend<{
    page: Page;
    utils: ReturnType<typeof getBaseUtils> & { assets: ReturnType<typeof getAssetsUtils> };
}>({
    utils: async ({ page }, use) => {
        const base = getBaseUtils(page);
        const assets = getAssetsUtils(base, page);
        await use({ ...base, assets });
    },
});

export function getBaseUtils(page: Page) {
    async function openSettings() {
        await page.getByRole('link', { name: 'Settings' }).click();
        await expect(page.getByText(`Manage members`)).toBeVisible();
    }

    async function generateDemonstration() {
        await openSettings();
        await page.getByText('Generate Demonstration').click();
    }

    async function createProperty({ property }: { property: Partial<Property> }) {
        await clickButton('Create Property');

        const propertyFake = fakeProperty();
        const streetAddress = property.streetAddress ?? propertyFake.streetAddress;
        await selectFromCombo<Property>('propertyType', property.propertyType ?? propertyFake.propertyType);

        await getByLabel<Property>('streetAddress').fill(streetAddress);
        await getByLabel<Property>('city').fill(property.city ?? propertyFake.city);
        await getByLabel<Property>('postalCode').fill(property.postalCode ?? propertyFake.postalCode);
        await getByLabel<Property>('country').fill(property.country ?? propertyFake.country);
        await getByLabel<Property>('state').fill(property.state ?? propertyFake.state ?? '');
        await getByLabel<Property>('name').fill(property.name ?? propertyFake.name);
        await getByLabel<Property>('surface').fill((property.surface ?? propertyFake.surface).toString());

        await getByLabel('private').check();
        await clickSaveChanges();

        await checkToastCreated('Property');
        return streetAddress;
    }

    async function createPropertyTenancy({
        propertyTenancy,
    }: {
        propertyTenancy: z.infer<typeof PropertyTenancyCreateScalarSchema>;
    }) {
        await clickButton('Create Property Tenancy');

        await selectFromCombo<PropertyTenancy>('type', propertyTenancy.type);
        await getByLabel<PropertyTenancy>('name').fill(propertyTenancy.name);

        switch (propertyTenancy.type) {
            case 'InCommon': {
                const tenancyInCommon = fakeTenancyInCommon();

                await getByLabel<PropertyTenancyInCommon>('streetAddress').fill(tenancyInCommon.streetAddress);
                await getByLabel<PropertyTenancyInCommon>('city').fill(tenancyInCommon.city);
                await getByLabel<PropertyTenancyInCommon>('postalCode').fill(tenancyInCommon.postalCode);
                await getByLabel<PropertyTenancyInCommon>('country').fill(tenancyInCommon.country);
                await getByLabel<PropertyTenancyInCommon>('intraCommunityVAT').fill(
                    tenancyInCommon.intraCommunityVAT ?? ''
                );
                await getByLabel<PropertyTenancyInCommon>('siren').fill(tenancyInCommon.siren ?? '');
                await getByLabel<PropertyTenancyInCommon>('siret').fill(tenancyInCommon.siret ?? '');
                break;
            }
            case 'ByEntirety': {
                await getByLabel<Person>('birthDate').fill('1990-12-12');
                await getByLabel<Person>('phone').fill('0607080901');
                break;
            }
            case 'Joint': {
                break;
            }
        }
        await clickSaveChanges();

        await checkToastCreated(propertyTenancy.name);
    }

    async function createFillScalarLeaseFields({ startDate }: { startDate: string }) {
        await clickButton('Create Lease');

        const rentAmount = faker.number.int({ max: 50000 });
        await getByLabel<Lease>('startDate').fill(startDate);
        await getByLabel<Lease>('rentAmount').fill(rentAmount.toString());
        return rentAmount;
    }

    async function createLease({ streetAddress, startDate }: { streetAddress: string; startDate: string }) {
        const rentAmount = await createFillScalarLeaseFields({ startDate });
        await clickSaveChanges();

        await expect(page.getByText(streetAddress)).toBeVisible();
        await expect(page.getByText(`Start Date: ${startDate}`)).toBeVisible();
        await expect(page.getByText(`$${rentAmount}`)).toBeVisible();
    }

    async function createLeaseFindProperty({ startDate }: { startDate: string }) {
        await createFillScalarLeaseFields({ startDate });

        await clickSaveChanges();
    }

    async function clickButton(name: string) {
        await page.getByRole('button', { name, exact: true }).click();
    }
    async function clickSaveChanges() {
        await page.getByText('Save changes', { exact: true }).click();
    }
    function getByLabel<T extends FieldValues>(label: FieldPath<T>) {
        return page.getByLabel(beautifyObjectName(label));
    }

    async function selectFromCombo<T extends FieldValues>(label: FieldPath<T>, type: string) {
        await page.getByTestId(`${beautifyObjectName(label)}-button-combo`).click();
        await page.locator(`span:has-text("${type}")`).click();
    }

    async function openHomeCreateSpace() {
        await page.goto('http://localhost:3000/');
        await page.getByText('Select space').click();
        await page.getByText('Create space').click();
        // Button in menu above, redundant button in page below
        await page.getByText('Create space').click();

        const name = faker.word.words(5);
        await getByLabel<Space>('name').fill(name);
        await clickSaveChanges();
        await page.getByRole('link', { name }).click();
    }

    async function checkToastCreated(name: string) {
        await expect(page.getByText(`${name} created successfully!`)).toBeVisible();
    }

    return {
        openSettings,
        generateDemonstration,
        createProperty,
        createPropertyTenancy,
        createLease,
        createLeaseFindProperty,
        clickButton,
        clickSaveChanges,
        getByLabel,
        selectFromCombo,
        openHomeCreateSpace,
        checkToastCreated,
    };
}
