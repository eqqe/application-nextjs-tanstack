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
    return {
        async openSettings() {
            await page.getByRole('link', { name: 'Settings' }).click();
            await expect(page.getByText(`Manage members`)).toBeVisible();
        },

        async generateDemonstration() {
            await this.openSettings();
            await page.getByText('Generate Demonstration').click();
        },

        async createProperty({ property }: { property: Partial<Property> }) {
            await this.clickButton('Create Property');

            const propertyFake = fakeProperty();
            const streetAddress = property.streetAddress ?? propertyFake.streetAddress;
            await this.selectFromCombo<Property>('propertyType', property.propertyType ?? propertyFake.propertyType);

            await this.getByLabel<Property>('streetAddress').fill(streetAddress);
            await this.getByLabel<Property>('city').fill(property.city ?? propertyFake.city);
            await this.getByLabel<Property>('postalCode').fill(property.postalCode ?? propertyFake.postalCode);
            await this.getByLabel<Property>('country').fill(property.country ?? propertyFake.country);
            await this.getByLabel<Property>('state').fill(property.state ?? propertyFake.state ?? '');
            await this.getByLabel<Property>('name').fill(property.name ?? propertyFake.name);
            await this.getByLabel<Property>('surface').fill((property.surface ?? propertyFake.surface).toString());

            await this.getByLabel('private').check();
            await this.clickSaveChanges();

            await this.checkToastCreated('Property');
            return streetAddress;
        },

        async createPropertyTenancy({
            propertyTenancy,
        }: {
            propertyTenancy: z.infer<typeof PropertyTenancyCreateScalarSchema>;
        }) {
            await this.clickButton('Create Property Tenancy');

            await this.selectFromCombo<PropertyTenancy>('type', propertyTenancy.type);
            await this.getByLabel<PropertyTenancy>('name').fill(propertyTenancy.name);

            switch (propertyTenancy.type) {
                case 'InCommon': {
                    const tenancyInCommon = fakeTenancyInCommon();

                    await this.getByLabel<PropertyTenancyInCommon>('streetAddress').fill(tenancyInCommon.streetAddress);
                    await this.getByLabel<PropertyTenancyInCommon>('city').fill(tenancyInCommon.city);
                    await this.getByLabel<PropertyTenancyInCommon>('postalCode').fill(tenancyInCommon.postalCode);
                    await this.getByLabel<PropertyTenancyInCommon>('country').fill(tenancyInCommon.country);
                    await this.getByLabel<PropertyTenancyInCommon>('intraCommunityVAT').fill(
                        tenancyInCommon.intraCommunityVAT ?? ''
                    );
                    await this.getByLabel<PropertyTenancyInCommon>('siren').fill(tenancyInCommon.siren ?? '');
                    await this.getByLabel<PropertyTenancyInCommon>('siret').fill(tenancyInCommon.siret ?? '');
                    break;
                }
                case 'ByEntirety': {
                    await this.getByLabel<Person>('birthDate').fill('1990-12-12');
                    await this.getByLabel<Person>('phone').fill('0607080901');
                    break;
                }
                case 'Joint': {
                    break;
                }
            }
            await this.clickSaveChanges();

            await this.checkToastCreated(propertyTenancy.name);
        },

        async clickButton(name: string) {
            await page.getByRole('button', { name }).click();
        },
        async clickSaveChanges() {
            await page.getByText('Save changes', { exact: true }).click();
        },
        getByLabel<T extends FieldValues>(label: FieldPath<T>) {
            return page.getByLabel(beautifyObjectName(label));
        },

        async selectFromCombo<T extends FieldValues>(label: FieldPath<T>, type: string) {
            await page.getByTestId(`${beautifyObjectName(label)}-button-combo`).click();
            await page.locator(`span:has-text("${type}")`).click();
        },
        async openHomeCreateSpace() {
            await page.goto('http://localhost:3000/');
            await page.getByText('Select space').click();
            await page.getByText('Create space').click();
            // Button in menu above, redundant button in page below
            await page.getByText('Create space').click();

            const name = faker.word.words(5);
            await this.getByLabel<Space>('name').fill(name);
            await this.clickSaveChanges();
            await page.getByRole('link', { name }).click();
        },

        async checkToastCreated(name: string) {
            await expect(page.getByText(`${name} created successfully!`)).toBeVisible();
        },
    };
}
