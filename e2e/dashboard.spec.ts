import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Dashboard } from '@zenstackhq/runtime/models';
import { test } from '@/e2e/utils';

test('Should create a dashboard', async ({ page, utils }) => {
    async function createDashboard() {
        await utils.clickButton('Create Dashboard');

        const name = faker.lorem.words(3);
        await utils.getByLabel<Dashboard>('name').fill(name);
        await utils.clickSaveChanges();

        await utils.checkToastCreated(name);

        await expect(page.getByRole('link', { name })).toBeVisible();
        return name;
    }

    await utils.openHomeCreateSpace();
    const dashboardTitle = await createDashboard();
    await page.getByRole('link', { name: dashboardTitle }).click();
    await expect(page.getByText(dashboardTitle, { exact: true })).toBeVisible();
});
