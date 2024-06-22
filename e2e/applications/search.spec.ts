import { fakeProperty } from '@/lib/demo/fake';
import { test } from '@/e2e/utils';
import { expect } from '@playwright/test';

test('Search for created property and tenancy, vs no result', async ({ page, utils }) => {
    await utils.openHomeCreateSpace();
    await utils.assets.enable();
    await utils.assets.openEssentialData();
    const propertyTenancyName = 'SCI Simon';
    await utils.assets.createPropertyTenancy({
        propertyTenancy: {
            type: 'InCommon',
            name: propertyTenancyName,
        },
    });
    const property = fakeProperty();
    property.city = 'city of simons';
    await utils.assets.createProperty({ property });
    await utils.search('Simon');

    async function checkResults() {
        await expect(page.getByText(property.city, { exact: true })).toBeVisible();
        await expect(page.getByText(propertyTenancyName, { exact: true })).toBeVisible();
        await expect(page.getByText(property.postalCode, { exact: true })).toBeVisible();
        await expect(page.getByText(property.country, { exact: true })).toBeVisible();
        await expect(page.getByText(property.streetAddress, { exact: true })).toBeVisible();
        await expect(page.getByText(property.surface.toString(), { exact: true })).toBeVisible();
        await expect(page.getByText(property.surface.toString(), { exact: true })).toBeVisible();
    }
    await checkResults();

    await utils.search('simO');
    await checkResults();

    await utils.search('simom');
    await expect(page.getByText('No result')).toBeVisible();
});
