import { expect } from '@playwright/test';
import { test } from '@/e2e/utils';
import { faker } from '@faker-js/faker';
import { Property } from '@zenstackhq/runtime/models';

test('Should enable assets application, see groups of properties, list them, edit one', async ({ page, utils }) => {
    await utils.openHomeCreateSpace();
    await utils.enableAssets();
    await utils.openApplication();

    const city = faker.location.city();
    const surface1 = faker.number.int({ max: 5000, min: 100 });
    const surface2 = faker.number.int({ max: 5000, min: 100 });
    await utils.createProperty({ property: { surface: surface1, city, propertyType: 'COMMERCIAL' } });
    await utils.createProperty({ property: { surface: surface2, city, propertyType: 'APARTMENT' } });

    const otherCity = faker.location.city();
    const surface3 = faker.number.int({ max: 5000, min: 100 });
    await utils.createProperty({ property: { surface: surface3, city: otherCity, propertyType: 'HOUSE' } });

    await expect(page.getByText('_sum Surface')).toBeVisible();
    await expect(page.getByText(city)).toBeVisible();
    await expect(page.getByText((surface1 + surface2).toString())).toBeVisible();
    await expect(page.getByText(surface3.toString())).toBeVisible();

    await page.getByRole('tab', { name: 'Month' }).click();

    // '..' is a xPath we use to get the parent element, once for the link, once for the row
    await page.getByText(otherCity).locator('..').locator('..').getByText('Edit Property').click();

    await expect(page.getByText(otherCity)).toBeVisible();

    const updatedCity = faker.location.city();
    const address = faker.location.streetAddress();

    await utils.getByLabel<Property>('city').fill(updatedCity);
    await utils.getByLabel<Property>('address').fill(address);

    await utils.clickSaveChanges();

    await expect(page.getByText(updatedCity)).toBeVisible();

    await page.getByText(address).click();
    await utils.createLease({ address, startDate: '2030-01-01' });
    await utils.createLease({ address, startDate: '2040-01-01' });
    await utils.createLease({ address, startDate: '2050-01-01' });
});
