import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { clickButton, openHome, getByLabel, selectFromCombo, clickSaveChanges, checkToastCreated } from './utils';
import { Lease, Property, PropertyType } from '@prisma/client';
import { fakeProperty } from '@/lib/fake';

test('Should create property', async ({ page }) => {
    async function createProperty({ type }: { type: PropertyType }) {
        await clickButton(page, 'Create Property');

        const property = fakeProperty();

        await selectFromCombo<Property>(page, 'propertyType', type);

        await getByLabel<Property>(page, 'address').fill(property.address);
        await getByLabel<Property>(page, 'city').fill(property.city);
        await getByLabel<Property>(page, 'postalCode').fill(property.postalCode);
        await getByLabel<Property>(page, 'country').fill(property.country);
        await getByLabel<Property>(page, 'name').fill(property.name);
        await getByLabel<Property>(page, 'surface').fill(property.surface.toString());
        await getByLabel(page, 'private').check();
        await clickSaveChanges(page);

        await checkToastCreated(page, property.name);
        await expect(page.getByText(property.address)).toBeVisible();
        await expect(page.getByText(`Type: ${type}`)).toBeVisible();
        await expect(page.getByText(`City: ${property.city}`)).toBeVisible();
        await expect(page.getByText(`Postal Code: ${property.postalCode}`)).toBeVisible();
        return property.address;
    }

    async function createLease({ address, startDate }: { address: string; startDate: string }) {
        await clickButton(page, 'Create Lease');

        const rentAmount = faker.number.bigInt({ max: 50000 });
        await getByLabel<Lease>(page, 'startDate').fill(startDate);
        await getByLabel<Lease>(page, 'rentAmount').fill(rentAmount.toString());
        await clickSaveChanges(page);

        await expect(page.getByText(address)).toBeVisible();
        await expect(page.getByText(`Start Date: ${startDate}`)).toBeVisible();
        await expect(page.getByText(`$${rentAmount}`)).toBeVisible();
    }

    await openHome(page);
    await createProperty({ type: 'APARTMENT' });
    await createProperty({ type: 'COMMERCIAL' });
    const address = await createProperty({ type: 'HOUSE' });

    await page.getByText(address).click();
    await createLease({ address, startDate: '2030-01-01' });
    await createLease({ address, startDate: '2040-01-01' });
    await createLease({ address, startDate: '2050-01-01' });
});
