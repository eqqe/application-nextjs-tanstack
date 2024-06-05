import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Dashboard } from '@zenstackhq/runtime/models';
import { clickButton, openHome, getByLabel, clickSaveChanges, checkToastCreated } from './utils';

test('Should create a dashboard', async ({ page }) => {
    async function createDashboard() {
        await clickButton(page, 'Create Dashboard');

        const name = faker.lorem.words(3);
        await getByLabel<Dashboard>(page, 'name').fill(name);
        await clickSaveChanges(page);

        await checkToastCreated(page, name);

        await expect(page.getByRole('link', { name })).toBeVisible();
        return name;
    }

    await openHome(page);
    const dashboardTitle = await createDashboard();
    await page.getByRole('link', { name: dashboardTitle }).click();
    await expect(page.getByText(dashboardTitle, { exact: true })).toBeVisible();
});
