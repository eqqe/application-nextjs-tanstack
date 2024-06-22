import { fakeProperty } from '@/lib/demo/fake';
import { test } from '@/e2e/utils';
import { expect } from '@playwright/test';
import { testUser } from '@/lib/demo/testUser';
import { User } from '@zenstackhq/runtime/models';
import { faker } from '@faker-js/faker';

test('Should edit user, go to settings, and go back to edit to see its updated', async ({ page, utils }) => {
    await utils.openHomeCreateSpace();

    async function goToUserUpdate() {
        await page.getByText(testUser.email[0].toUpperCase(), { exact: true }).click();
        await page.getByText('User', { exact: true }).click();
    }
    await goToUserUpdate();

    const name = faker.person.firstName();
    await utils.getByLabel<User>('name').fill(name);
    await utils.clickSaveChanges();
    await expect(page.getByText(`User updated successfully!`)).toBeVisible();

    async function checkInputValue() {
        const input = utils.getByLabel<User>('name');
        await expect(input).toHaveValue(name);
    }
    await checkInputValue();
    await utils.openSettings();
    await goToUserUpdate();
    await checkInputValue();
});
