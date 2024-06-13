import { FieldPath, FieldValues } from 'react-hook-form';
import { beautifyObjectName } from '@/components/ui/auto-form/utils';
import { faker } from '@faker-js/faker';
import { Lease, Space } from '@zenstackhq/runtime/models';
import { expect, Page, test as base } from '@playwright/test';
import { Property } from '@prisma/client';
import { fakeProperty } from '@/lib/demo/fake';

export const test = base.extend<{ page: Page; utils: ReturnType<typeof getUtils> }>({
    utils: async ({ page }, use) => {
        const utils = getUtils(page);
        await use(utils);
    },
});

function getUtils(page: Page) {
    async function openSettings() {
        await page.getByRole('link', { name: 'Settings' }).click();
    }
    async function openSubTab() {
        await page.getByText('SubTab Properties subTab').click();
    }
    async function openGrid() {
        await page.getByText('Properties Grid').click();
    }

    async function generateDemonstration() {
        await openSettings();
        await page.getByText('Generate Demonstration').click();
    }

    async function enableAssets() {
        await openSettings();
        await page.getByText('Enable Assets').click();
    }

    async function createProperty({ property }: { property: Partial<Property> }) {
        await clickButton('Create Property');

        const propertyFake = fakeProperty();
        const streetAddress = property.streetAddress ?? propertyFake.streetAddress;
        await selectFromCombo<Property>('propertyType', property.propertyType ?? propertyFake.propertyType);

        await getByLabel<Property>('streetAddress').fill(streetAddress);
        await getByLabel<Property>('city').fill(property.city ?? propertyFake.city);
        await getByLabel<Property>('postalCode').fill(property.postalCode ?? propertyFake.postalCode);
        await getByLabel<Property>('country').fill(property.country ?? propertyFake.country);
        await getByLabel<Property>('state').fill(property.state ?? propertyFake.state ?? '');
        await getByLabel<Property>('name').fill(property.name ?? propertyFake.name);
        await getByLabel<Property>('surface').fill((property.surface ?? propertyFake.surface).toString());
        await getByLabel('private').check();
        await clickSaveChanges();

        await checkToastCreated('Property');
        return streetAddress;
    }

    async function createLease({ streetAddress, startDate }: { streetAddress: string; startDate: string }) {
        await clickButton('Create Lease');

        const rentAmount = faker.number.int({ max: 50000 });
        await getByLabel<Lease>('startDate').fill(startDate);
        await getByLabel<Lease>('rentAmount').fill(rentAmount.toString());
        await clickSaveChanges();

        await expect(page.getByText(streetAddress)).toBeVisible();
        await expect(page.getByText(`Start Date: ${startDate}`)).toBeVisible();
        await expect(page.getByText(`$${rentAmount}`)).toBeVisible();
    }

    async function clickButton(name: string) {
        await page.getByRole('button', { name }).click();
    }
    async function clickSaveChanges() {
        await page.getByText('Save changes', { exact: true }).click();
    }
    function getByLabel<T extends FieldValues>(label: FieldPath<T>) {
        return page.getByLabel(beautifyObjectName(label));
    }

    async function selectFromCombo<T extends FieldValues>(label: FieldPath<T>, type: string) {
        await page.getByTestId(`${beautifyObjectName(label)}-button-combo`).click();
        await page.locator(`span:has-text("${type}")`).click();
    }

    async function openHome() {
        // TODO SRE re add home button in nav
        await page.goto('http://localhost:3000/');
    }

    async function openHomeCreateSpace() {
        await openHome();
        await page.getByText('Select space').click();
        await page.getByText('Create space').click();
        // Button in menu above, redundant button in page below
        await page.getByText('Create space').click();

        const name = faker.word.words(5);
        await getByLabel<Space>('name').fill(name);
        await clickSaveChanges();
        await page.getByRole('link', { name }).click();
    }

    async function checkToastCreated(name: string) {
        await expect(page.getByText(`${name} created successfully!`)).toBeVisible();
    }

    return {
        openSettings,
        openSubTab,
        openGrid,
        generateDemonstration,
        enableAssets,
        createProperty,
        createLease,
        clickButton,
        clickSaveChanges,
        getByLabel,
        selectFromCombo,
        openHome,
        openHomeCreateSpace,
        checkToastCreated,
    };
}
