import { expect } from '@playwright/test';
import { test } from '@/e2e/utils';

test('Should add lease on demo data', async ({ page, utils }) => {
    const { openHomeCreateSpace, assets, generateDemonstration } = utils;
    await openHomeCreateSpace();
    await assets.enable();
    await generateDemonstration();
    await utils.assets.openEssentialData();
    await assets.createLeaseFindProperty({ startDate: '2050-05-12' });
});
