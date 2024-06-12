import { expect } from '@playwright/test';
import { test } from '@/e2e/utils';

test('Should enable assets application, rollback, and update', async ({ page, utils }) => {
    const { openHomeCreateSpace, enableAssets, openSubTab, openGrid, generateDemonstration, openSettings } = utils;
    await openHomeCreateSpace();
    await enableAssets();
    await openSubTab();
    await openGrid();
    await expect(page.getByText('This Week')).toBeVisible();
    await expect(page.getByText('Your properties')).toBeVisible();
    await expect(page.getByText('Listed here')).toBeVisible();
    await page.getByRole('tab', { name: 'Month' }).click();
    await expect(page.getByRole('cell', { name: 'Address' })).toBeVisible();
    await expect(page.getByText('City')).toBeVisible();
    await expect(page.getByText('Postal Code')).toBeVisible();
    await expect(page.getByText('No results.')).toBeVisible();

    await generateDemonstration();
    await openSubTab();
    await openGrid();
    await page.getByRole('tab', { name: 'Month' }).click();
    const propertyTest = 'Property to find in Playwright test';
    await expect(page.getByText(propertyTest)).toBeVisible();
    await openSettings();
    const rollbackButtonText = 'Rollback to version 0.1';
    await page.getByText(rollbackButtonText).click();
    await openSubTab();
    // Nav link is not refreshed sometimes
    await openSubTab();
    await openGrid();
    await expect(page.getByText('Your properties v0.1')).toBeVisible();
    await openSettings();
    await page.getByText('Update to version 0.2').click();
    await expect(page.getByText(rollbackButtonText)).toBeVisible();
    await openSubTab();
    // Nav link is not refreshed sometimes
    await openSubTab();
    await openGrid();
    await page.getByRole('tab', { name: 'Month' }).click();
    await expect(page.getByText(propertyTest)).toBeVisible();
});
