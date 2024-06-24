import { expect } from '@playwright/test';
import { test } from '@/e2e/utils';
import { faker } from '@faker-js/faker';
import { Property } from '@prisma/client';
import { fakeProperty, fakeTenancyInCommon } from '@/lib/demo/fake';

test('Should enable assets application, see groups of properties, list them, edit one', async ({ page, utils }) => {
    await utils.openHomeCreateSpace();
    await utils.assets.enable();
    await page.getByText('Properties').click();

    const city = faker.location.city();
    const property1 = fakeProperty();
    property1.city = city;
    const property2 = fakeProperty();
    property2.city = city;
    await utils.assets.createProperty({ property: property1 });
    await utils.assets.createProperty({ property: property2 });

    const otherCity = faker.location.city();
    const surface3 = faker.number.int({ max: 5000, min: 100 });
    await utils.assets.createProperty({ property: { surface: surface3, propertyType: 'HOUSE', city: otherCity } });
    await page.getByRole('tab', { name: 'Surface / city' }).click();

    await expect(page.getByText('_sum Surface')).toBeVisible();
    await expect(page.getByText(city)).toBeVisible();
    await expect(page.getByText((property1.surface + property2.surface).toString())).toBeVisible();
    await expect(page.getByText(surface3.toString())).toBeVisible();

    await page.getByRole('tab', { name: 'All' }).click();

    // '..' is a xPath we use to get the parent element
    await page.getByText(otherCity).locator('..').getByText('Edit Property').click();

    await expect(page.getByText(otherCity)).toBeVisible();

    const updatedCity = faker.location.city();
    const streetAddress = faker.location.streetAddress();

    await utils.getByLabel<Property>('city').fill(updatedCity);
    await utils.getByLabel<Property>('streetAddress').fill(streetAddress);

    await utils.clickSaveChanges();

    await expect(page.getByText(updatedCity)).toBeVisible();
});

test('Should enable assets application, see essential data, create a property tenancy', async ({ page, utils }) => {
    await utils.openHomeCreateSpace();
    await utils.assets.enable();
    await utils.assets.openEssentialData();

    let property = fakeProperty();
    await utils.assets.createProperty({ property });

    const titleCommon = 'Your propertyTenancyInCommon';
    const titleEntirety = 'Your propertyTenancyByEntirety';
    const titleJoint = 'Your propertyJointTenancy';
    await utils.checkCountInCard({ title: titleCommon, count: 0 });

    await utils.assets.createpropertyTenancyInCommon({
        propertyTenancyName: 'SCI Simon',
        tenancyInCommon: fakeTenancyInCommon(),
        surface: property.surface,
    });

    await utils.checkCountInCard({ title: titleCommon, count: 1 });
    await utils.checkCountInCard({ title: titleEntirety, count: 0 });
    await utils.checkCountInCard({ title: titleJoint, count: 0 });

    property = fakeProperty();
    await utils.assets.createProperty({ property });

    /* TODO SRE : sub model creation
    await utils.assets.createpropertyTenancyByEntirety({
        propertyTenancyName: 'Simon',
        byEntirety: {},
        surface: property.surface,
    });

    await utils.checkCountInCard({ title: titleCommon, count: 1 });
    await utils.checkCountInCard({ title: titleEntirety, count: 1 });
    await utils.checkCountInCard({ title: titleJoint, count: 0 });

    property = fakeProperty();
    await utils.assets.createProperty({ property });

    await utils.assets.createpropertyTenancyByEntirety({
        propertyTenancyName: 'Simon 2',
        byEntirety: {},
        surface: property.surface,
    });

    await utils.checkCountInCard({ title: titleCommon, count: 1 });
    await utils.checkCountInCard({ title: titleEntirety, count: 2 });
    await utils.checkCountInCard({ title: titleJoint, count: 0 });
*/
    property = fakeProperty();
    await utils.assets.createProperty({ property });

    await utils.assets.createPropertyTenancyJoint({
        propertyTenancyName: 'Simons',
        jointTenancy: {},
        surface: property.surface,
    });

    await utils.checkCountInCard({ title: titleCommon, count: 1 });
    await utils.checkCountInCard({ title: titleEntirety, count: 0 });
    await utils.checkCountInCard({ title: titleJoint, count: 1 });
});
