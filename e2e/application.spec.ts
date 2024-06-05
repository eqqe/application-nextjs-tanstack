import { expect, test } from '@playwright/test';
import { openHome } from './utils';
test('Should enable application that list properties', async ({ page }) => {
    async function openSettings() {
        await page.getByRole('link', { name: 'Settings' }).click();
    }
    async function openApplication() {
        await page.getByText('Application Assets').click();
    }
    await openHome(page);
    await openSettings();
    await page.getByText('Enable Assets').click();
    await openApplication();
    await expect(page.getByText('This Week')).toBeVisible();
    await expect(page.getByText('Your properties')).toBeVisible();
    await expect(page.getByText('Listed here')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Address' })).toBeVisible();
    await expect(page.getByText('City')).toBeVisible();
    await expect(page.getByText('Postal Code')).toBeVisible();
    await expect(page.getByText('No results.')).toBeVisible();

    await openSettings();
    await page.getByText('Generate Demonstration').click();
    await openApplication();
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
    await expect(page.getByText(propertyTest)).toBeVisible();
});
