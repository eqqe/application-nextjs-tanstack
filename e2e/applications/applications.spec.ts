import { expect } from '@playwright/test';
import { test } from '@/e2e/utils';
import { cityPlaywrightTest } from '@/lib/demo/fake';
import { lenghtDemo } from '@/components/Space/GenerateDemonstration';
import assert from 'assert';

test('Should enable assets application, rollback, and update', async ({ page, utils }) => {
    const { openHomeCreateSpace, assets, generateDemonstration, openSettings } = utils;
    await openHomeCreateSpace();
    await assets.enable();
    await page.getByText('Properties').click();
    await expect(page.getByText('This Week')).toBeVisible();
    await expect(page.getByText('Your properties')).toBeVisible();
    await expect(page.getByText('Listed here')).toBeVisible();
    await page.getByRole('tab', { name: 'All' }).click();
    await expect(page.getByRole('cell', { name: 'Street Address' })).toBeVisible();
    await expect(page.getByText('City', { exact: true })).toBeVisible();
    await expect(page.getByText('Postal Code')).toBeVisible();
    await expect(page.getByText('No results.')).toBeVisible();

    await generateDemonstration();
    await utils.assets.openEssentialData();

    assert(lenghtDemo > 2);

    await utils.checkCountInCard({ title: 'Your PropertyTenancyInCommon', count: lenghtDemo });
    await utils.checkCountInCard({ title: 'Your leases', count: lenghtDemo * lenghtDemo });
    await utils.checkCountInCard({ title: 'Your properties', count: lenghtDemo });
    await utils.checkCountInCard({ title: 'Your persons', count: 2 * lenghtDemo * lenghtDemo });

    await utils.openSettings();
    await page.getByText('Properties').click();
    await page.getByRole('tab', { name: 'All' }).click();
    await expect(page.getByText(cityPlaywrightTest)).toBeVisible();
    await openSettings();
    const rollbackButtonText = 'Rollback to version 0.1';
    await page.getByText(rollbackButtonText).click();
    await page.getByText('List of properties').click();
    await expect(page.getByText('Your properties v0.1')).toBeVisible();
    await openSettings();
    await page.getByText('Update to version 0.2').click();
    await expect(page.getByText(rollbackButtonText)).toBeVisible();
    await page.getByText('Properties').click();
    await page.getByRole('tab', { name: 'All' }).click();
    await expect(page.getByText(cityPlaywrightTest)).toBeVisible();
});
