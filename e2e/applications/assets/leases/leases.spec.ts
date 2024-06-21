import { expect } from '@playwright/test';
import { test } from '@/e2e/utils';
import { faker } from '@faker-js/faker';

test('Should add lease on property', async ({ page, utils }) => {
    const { openHomeCreateSpace, assets } = utils;

    await openHomeCreateSpace();
    await assets.enable();
    await utils.assets.openEssentialData();

    const name = faker.word.noun();
    await utils.createProperty({ property: { name } });

    await expect(page.getByText(`leases0 Lease`)).toBeVisible();

    await assets.createLeaseFindProperty({ name, startDate: '2050-05-12' });
    await expect(page.getByText(`leases1 Lease`)).toBeVisible();
});
