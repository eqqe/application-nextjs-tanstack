import { expect } from '@playwright/test';
import { test } from '@/e2e/utils';

test('Should enable assets application, rollback, and update', async ({ page, utils }) => {
    const { openHomeCreateSpace, enableAssets, openApplication, generateDemonstration, openSettings } = utils;
    await openHomeCreateSpace();
    await enableAssets();
    await openApplication();
    await expect(page.getByText('This Week')).toBeVisible();
    await expect(page.getByText('Your properties')).toBeVisible();
    await expect(page.getByText('Listed here')).toBeVisible();
    await page.getByRole('tab', { name: 'Month' }).click();
    await expect(page.getByRole('cell', { name: 'Address' })).toBeVisible();
    await expect(page.getByText('City')).toBeVisible();
    await expect(page.getByText('Postal Code')).toBeVisible();
    await expect(page.getByText('No results.')).toBeVisible();

    await generateDemonstration();
    await openApplication();
    await page.getByRole('tab', { name: 'Month' }).click();
    const propertyTest = 'Property to find in Playwright test';
    await expect(page.getByText(propertyTest)).toBeVisible();
    await openSettings();
    const rollbackButtonText = 'Rollback to version 0.1';
    await page.getByText(rollbackButtonText).click();
    await openApplication();
    // Nav link is not refreshed sometimes
    await openApplication();
    await expect(page.getByText('Your properties v0.1')).toBeVisible();
    await openSettings();
    await page.getByText('Update to version 0.2').click();
    await expect(page.getByText(rollbackButtonText)).toBeVisible();
    await openApplication();
    // Nav link is not refreshed sometimes
    await openApplication();
    await page.getByRole('tab', { name: 'Month' }).click();
    await expect(page.getByText(propertyTest)).toBeVisible();
});
