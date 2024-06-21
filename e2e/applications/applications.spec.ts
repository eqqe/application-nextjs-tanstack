import { expect } from '@playwright/test';
import { test } from '@/e2e/utils';
import { cityPlaywrightTest } from '@/lib/demo/fake';
import { lenghtDemo } from '@/components/Space/GenerateDemonstration';

test('Should enable assets application, rollback, and update', async ({ page, utils }) => {
    const { openHomeCreateSpace, assets, generateDemonstration, openSettings } = utils;
    await openHomeCreateSpace();
    await assets.enable();
    await page.getByText('Properties').click();
    await expect(page.getByText('This Week')).toBeVisible();
    await expect(page.getByText('Your properties')).toBeVisible();
    await expect(page.getByText('Listed here')).toBeVisible();
    await page.getByRole('tab', { name: 'Month' }).click();
    await expect(page.getByRole('cell', { name: 'Address' })).toBeVisible();
    await expect(page.getByText('City')).toBeVisible();
    await expect(page.getByText('Postal Code')).toBeVisible();
    await expect(page.getByText('No results.')).toBeVisible();

    await generateDemonstration();
    await utils.assets.openEssentialData();
    await expect(page.getByText(`property tenants${lenghtDemo} Property Tenancy`)).toBeVisible();
    await expect(page.getByText(`leases${lenghtDemo * lenghtDemo} Lease`)).toBeVisible();
    await expect(page.getByText(`properties${lenghtDemo} Property`)).toBeVisible();
    await expect(page.getByText(`lease tenants${lenghtDemo * lenghtDemo} Lease Tenant`)).toBeVisible();

    await utils.openSettings();
    await page.getByText('Properties').click();
    await page.getByRole('tab', { name: 'Month' }).click();
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
    await page.getByRole('tab', { name: 'Month' }).click();
    await expect(page.getByText(cityPlaywrightTest)).toBeVisible();
});
