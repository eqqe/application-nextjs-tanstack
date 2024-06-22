import { FieldPath, FieldValues } from 'react-hook-form';
import { beautifyObjectName } from '@/components/ui/auto-form/utils';
import { faker } from '@faker-js/faker';
import { Space } from '@prisma/client';
import { expect, Page, test as base } from '@playwright/test';
import { getAssetsUtils } from '@/e2e/applications/assets/utils';

export const test = base.extend<{
    page: Page;
    utils: ReturnType<typeof getBaseUtils> & { assets: ReturnType<typeof getAssetsUtils> };
}>({
    utils: async ({ page }, use) => {
        const base = getBaseUtils(page);
        const assets = getAssetsUtils(base, page);
        await use({ ...base, assets });
    },
});

export function getBaseUtils(page: Page) {
    async function openSettings() {
        await page.getByRole('link', { name: 'Settings' }).click();
        await expect(page.getByText(`Manage members`)).toBeVisible();
    }

    async function generateDemonstration() {
        await openSettings();
        await page.getByText('Generate Demonstration').click();
    }

    async function clickButton(name: string) {
        await page.getByRole('button', { name, exact: true }).click();
    }
    async function clickSaveChanges() {
        await page.getByText('Save changes', { exact: true }).click();
    }
    function getByLabel<T extends FieldValues>(label: FieldPath<T>) {
        return page.getByLabel(beautifyObjectName(label));
    }

    async function selectFromCombo<T extends FieldValues>(label: FieldPath<T>, type: string) {
        await page.getByTestId(`${beautifyObjectName(label)}-button-combo`).click();
        await page.locator(`span:text-is("${type}")`).click();
    }

    async function openHomeCreateSpace() {
        await page.goto('http://localhost:3000/');
        await page.getByText('Select space').click();
        await page.getByText('Create space').click();

        const name = faker.word.words(5);
        await getByLabel<Space>('name').fill(name);
        await clickSaveChanges();
        await page.getByRole('link', { name }).click();
    }

    async function checkToastCreated(name: string) {
        await expect(page.getByText(`${name} created successfully!`)).toBeVisible();
    }

    async function search(query: string) {
        await page.getByPlaceholder('Search...').fill(query);
        await page.keyboard.press('Enter');
    }

    async function checkCountInCard({ title, count }: { title: string; count: number }) {
        await expect(page.getByText(title).locator('..').getByText(count.toString())).toBeVisible();
    }

    return {
        openSettings,
        generateDemonstration,
        clickButton,
        clickSaveChanges,
        getByLabel,
        selectFromCombo,
        openHomeCreateSpace,
        checkToastCreated,
        search,
        checkCountInCard,
    };
}
