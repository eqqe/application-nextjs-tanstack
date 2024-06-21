import { getBaseUtils } from '@/e2e/utils';
import { faker } from '@faker-js/faker';
import { Page, expect } from '@playwright/test';
import { Lease } from '@zenstackhq/runtime/models';

export function getAssetsUtils(base: ReturnType<typeof getBaseUtils>, page: Page) {
    async function enable() {
        await base.openSettings();
        await page.getByText('Enable Assets').click();
    }
    async function openEssentialData() {
        await page.getByText('Your essential data').click();
    }
    async function createFillScalarLeaseFields({ startDate }: { startDate: string }) {
        await base.clickButton('Create Lease');

        const rentAmount = faker.number.int({ max: 50000 });
        await base.getByLabel<Lease>('startDate').fill(startDate);
        await base.getByLabel<Lease>('rentAmount').fill(rentAmount.toString());
        return rentAmount;
    }

    async function createLease({ streetAddress, startDate }: { streetAddress: string; startDate: string }) {
        const rentAmount = await createFillScalarLeaseFields({ startDate });
        await base.clickSaveChanges();

        await expect(page.getByText(streetAddress)).toBeVisible();
        await expect(page.getByText(`Start Date: ${startDate}`)).toBeVisible();
        await expect(page.getByText(`$${rentAmount}`)).toBeVisible();
    }

    async function createLeaseFindProperty({ startDate }: { startDate: string }) {
        await createFillScalarLeaseFields({ startDate });

        await base.clickSaveChanges();
    }
    return {
        enable,
        openEssentialData,
        createLease,
        createLeaseFindProperty,
    };
}
