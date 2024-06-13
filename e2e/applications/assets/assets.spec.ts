import { expect } from '@playwright/test';
import { test } from '@/e2e/utils';
import { faker } from '@faker-js/faker';
import { Property } from '@zenstackhq/runtime/models';
import { fakeProperty } from '@/lib/demo/fake';

test('Should enable assets application, see groups of properties, list them, edit one', async ({ page, utils }) => {
    await utils.openHomeCreateSpace();
    await utils.enableAssets();
    await utils.openSubTab();
    await utils.openGrid();

    const city = faker.location.city();
    const property1 = fakeProperty();
    property1.city = city;
    const property2 = fakeProperty();
    property2.city = city;
    await utils.createProperty({ property: property1 });
    await utils.createProperty({ property: property2 });

    const otherCity = faker.location.city();
    const surface3 = faker.number.int({ max: 5000, min: 100 });
    await utils.createProperty({ property: { surface: surface3, propertyType: 'HOUSE', city: otherCity } });

    await expect(page.getByText('_sum Surface')).toBeVisible();
    await expect(page.getByText(city)).toBeVisible();
    await expect(page.getByText((property1.surface + property2.surface).toString())).toBeVisible();
    await expect(page.getByText(surface3.toString())).toBeVisible();

    await page.getByRole('tab', { name: 'Month' }).click();

    // '..' is a xPath we use to get the parent element
    await page.getByText(otherCity).locator('..').getByText('Edit Property').click();

    await expect(page.getByText(otherCity)).toBeVisible();

    const updatedCity = faker.location.city();
    const streetAddress = faker.location.streetAddress();

    await utils.getByLabel<Property>('city').fill(updatedCity);
    await utils.getByLabel<Property>('streetAddress').fill(streetAddress);

    await utils.clickSaveChanges();

    await expect(page.getByText(updatedCity)).toBeVisible();

    await page.getByText(streetAddress).click();
    await utils.createLease({ streetAddress: streetAddress, startDate: '2030-01-01' });
    await utils.createLease({ streetAddress: streetAddress, startDate: '2040-01-01' });
    await utils.createLease({ streetAddress: streetAddress, startDate: '2050-01-01' });
});
