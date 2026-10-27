//Import { test, expect } from '@playwright/test';
import { test, expect } from '@playwright/test';

//This BeforeEach hook will run before each test in this file. It navigates to the specified URL before each test is executed.
test.beforeEach(async ({ page }) => {
  await page.goto('https://conduit.bondaracademy.com/');
})

//This test checks if the page has the expected title. It locates the element with the class 'navbar-brand' and verifies that its text matches the regular expression /conduit/.
test('Has Title', async ({ page }) => {
  await expect(page.locator('.navbar-brand')).toHaveText(/conduit/);
});