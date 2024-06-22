import { expect } from '@playwright/test';
import { test } from '@/e2e/utils';
import { faker } from '@faker-js/faker';

test('Should add lease on property', async ({ page, utils }) => {
    const { openHomeCreateSpace, assets } = utils;

    await openHomeCreateSpace();
    await assets.enable();
    await utils.assets.openEssentialData();

    const name = faker.word.noun();
    await utils.assets.createProperty({ property: { name } });

    await utils.checkCountInCard({ title: 'Your leases', count: 0 });

    await assets.createLeaseFindProperty({ name, startDate: '2050-05-12' });
    await utils.checkCountInCard({ title: 'Your leases', count: 1 });

    await assets.createLeaseFindProperty({ name, startDate: '2060-05-12' });
    await utils.checkCountInCard({ title: 'Your leases', count: 2 });
});
