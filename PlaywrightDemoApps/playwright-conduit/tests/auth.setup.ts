import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
    // Perform authentication steps. Replace these actions with whatever credentials you need.
    await page.goto('https://conduit.bondaracademy.com/');              // Navigate to the Conduit application.
    await page.getByText('Sign in').click()                       // Click the Sign in link.
    await page.getByRole('textbox', { name: 'Email' }).fill('ckentTest+christopherikent@gmail.com') // Enter the email address.
    await page.getByRole('textbox', { name: 'Password' }).fill('ckentTest321') // Enter the password.
    await page.getByRole('button', { name: 'Sign in' }).click()                 // Click the Sign in button.
    
    await expect(page.getByRole('link', { name: 'New Article' })).toBeVisible();

    // End of authentication steps.

    await page.context().storageState({ path: authFile });
});