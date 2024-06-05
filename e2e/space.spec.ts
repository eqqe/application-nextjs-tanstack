import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { clickButton, openHome, getByLabel, selectFromCombo, clickSaveChanges, checkToastCreated } from './utils';
import { Lease, Property, Space } from '@zenstackhq/runtime/models';

test('Should create space', async ({ page }) => {
    await openHome(page);
    await page.getByText('Select space').click();
    await page.getByText('Create space').click();
    // Button in menu above, redundant button in page below
    await page.getByText('Create space').click();

    const name = faker.word.words(5);
    await getByLabel<Space>(page, 'name').fill(name);
    await clickSaveChanges(page);
    await page.getByRole('link', { name }).click();
});
