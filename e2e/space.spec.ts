import { test } from '@playwright/test';
import { openHome } from './utils';

test('Should create space', async ({ page }) => {
    await openHome(page);
});
