import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page, request }) => {
    if (fs.existsSync(authFile)) {
        const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
            data: {                     // Add the user credentials to the request body.
                "user": {
                    "email": "ckentTest+christopherikent@gmail.com",
                    "password": "ckentTest321"
                }
            }
        })
        expect(loginResponse.status()).toEqual(200)         // Verify that the user logged in successfully.
        const responseLoginJSON = await loginResponse.json()
        const token = responseLoginJSON.user.token

        const storageStateFile = JSON.parse(fs.readFileSync(authFile, 'utf-8'))
        storageStateFile.origins[0].localStorage[0].value = token
        fs.writeFileSync(authFile, JSON.stringify(storageStateFile, null, 2))
    } else {
        await page.goto('https://conduit.bondaracademy.com/');              // Navigate to the Conduit application.
        await page.getByText('Sign in').click()                       // Click the Sign in link.
        await page.getByRole('textbox', { name: 'Email' }).fill('ckentTest+christopherikent@gmail.com') // Enter the email address.
        await page.getByRole('textbox', { name: 'Password' }).fill('ckentTest321') // Enter the password.
        await page.getByRole('button', { name: 'Sign in' }).click()                 // Click the Sign in button.

        await expect(page.getByRole('link', { name: 'New Article' })).toBeVisible();

        await page.context().storageState({ path: authFile });
    }

});