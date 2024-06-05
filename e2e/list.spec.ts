import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { List } from '@zenstackhq/runtime/models';
import { clickButton, openHome, getByLabel, clickSaveChanges, checkToastCreated } from './utils';

test('should create List', async ({ page }) => {
    async function createList() {
        await clickButton(page, 'Create List');
        const name = faker.lorem.words(3);
        await getByLabel<List>(page, 'name').fill(name);
        await clickSaveChanges(page);
        await checkToastCreated(page, name);
        await expect(page.getByText(name, { exact: true })).toBeVisible();
        return name;
    }

    async function createTodo() {
        const title = faker.lorem.words(5);

        await page.getByPlaceholder('Type a title and press enter').fill(title);
        await page.keyboard.press('Enter');

        await expect(page.getByText(title)).toBeVisible();
    }

    await openHome(page);

    await createList();
    await createList();
    const listTitle = await createList();
    await page.getByText(listTitle, { exact: true }).click();
    await createTodo();
    await createTodo();
});
