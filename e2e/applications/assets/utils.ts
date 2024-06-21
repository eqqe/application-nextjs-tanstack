import { getBaseUtils } from '@/e2e/utils';
import { base, faker } from '@faker-js/faker';
import { Page, expect } from '@playwright/test';
import { Lease } from '@zenstackhq/runtime/models';

export function getAssetsUtils(base: ReturnType<typeof getBaseUtils>, page: Page) {
    return {
        async enable() {
            await base.openSettings();
            await page.getByText('Enable Assets').click();
        },
        async openEssentialData() {
            await page.getByText('Your essential data').click();
        },
        async createFillScalarLeaseFields({ startDate }: { startDate: string }) {
            await base.clickButton('Create Lease');

            const rentAmount = faker.number.int({ max: 50000 });
            await base.getByLabel<Lease>('startDate').fill(startDate);
            await base.getByLabel<Lease>('rentAmount').fill(rentAmount.toString());
            return rentAmount;
        },

        async createLease({ streetAddress, startDate }: { streetAddress: string; startDate: string }) {
            const rentAmount = await this.createFillScalarLeaseFields({ startDate });
            await base.clickSaveChanges();

            await expect(page.getByText(streetAddress)).toBeVisible();
            await expect(page.getByText(`Start Date: ${startDate}`)).toBeVisible();
            await expect(page.getByText(`$${rentAmount}`)).toBeVisible();
        },

        async createLeaseFindProperty({ startDate }: { startDate: string }) {
            await this.createFillScalarLeaseFields({ startDate });

            await base.clickSaveChanges();
        },
    };
}
