import { test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { Dashboard } from '@zenstackhq/runtime/models';
import { clickButton, openHome, getByLabel } from './utils';

test('should navigate to the about page', async ({ page }) => {
    async function createDashboard() {
        await clickButton(page, 'Create Dashboard');

        const name = faker.lorem.words(3);
        await getByLabel<Dashboard>(page, 'name').fill(name);
        await page.getByText('Save changes', { exact: true }).click();

        page.getByText('Dashboard created successfully!');
        page.getByText(name);
        return name;
    }

    await openHome(page);
    const dashboardTitle = await createDashboard();
    await page.getByText(dashboardTitle).click();
    page.getByText(dashboardTitle);
});
