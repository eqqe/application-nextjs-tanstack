import { Page, expect } from '@playwright/test';
import { FieldPath, FieldValues } from 'react-hook-form';
import { beautifyObjectName } from '@/components/ui/auto-form/utils';
import { faker } from '@faker-js/faker';
import { Space } from '@zenstackhq/runtime/models';

export async function clickButton(page: Page, name: string) {
    await page.getByRole('button', { name }).click();
}
export async function clickSaveChanges(page: Page) {
    await page.getByText('Save changes', { exact: true }).click();
}
export function getByLabel<T extends FieldValues>(page: Page, label: FieldPath<T>) {
    return page.getByLabel(beautifyObjectName(label));
}

export async function selectFromCombo<T extends FieldValues>(page: Page, label: FieldPath<T>, type: string) {
    await page.getByTestId(`${beautifyObjectName(label)}-button-combo`).click();
    await page.locator(`span:has-text("${type}")`).click();
}

export async function openHome(page: Page) {
    await page.goto('http://localhost:3000/');
    await page.getByText('Select space').click();
    await page.getByText('Create space').click();
    // Button in menu above, redundant button in page below
    await page.getByText('Create space').click();

    const name = faker.word.words(5);
    await getByLabel<Space>(page, 'name').fill(name);
    await clickSaveChanges(page);
    await page.getByRole('link', { name }).click();
}

export async function checkToastCreated(page: Page, name: string) {
    await expect(page.getByText(`${name} created successfully!`)).toBeVisible();
}
