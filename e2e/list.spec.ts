import { expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { List } from '@zenstackhq/runtime/models';
import { test } from '@/e2e/utils';

test('should create List', async ({ page, utils }) => {
    async function createList() {
        await utils.clickButton('Create List');
        const name = faker.lorem.words(3);
        await utils.getByLabel<List>('name').fill(name);
        await utils.clickSaveChanges();
        await utils.checkToastCreated(name);
        await expect(page.getByText(name, { exact: true })).toBeVisible();
        return name;
    }

    async function createTodo() {
        const title = faker.lorem.words(5);

        await page.getByPlaceholder('Type a title and press enter').fill(title);
        await page.keyboard.press('Enter');

        await expect(page.getByText(title)).toBeVisible();
    }

    await utils.openHomeCreateSpace();

    await createList();
    await createList();
    const listTitle = await createList();
    await page.getByText(listTitle, { exact: true }).click();
    await createTodo();
    await createTodo();
});
