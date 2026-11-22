import { test, expect } from '@playwright/test';

test('Smoke Test Application Loads', async ({ page }) => {
    await page.goto('https://conduit.bondaracademy.com/');              // Navigate to the Conduit application.
    await expect(page.locator('.navbar-brand')).toHaveText(/conduit/);        // Verify that the Conduit logo is displayed.
    await expect(page.locator('.sidebar .tag-pill')).toContainText(['Bondar Academy']);        // Verify that the tags are displayed in the sidebar.
});