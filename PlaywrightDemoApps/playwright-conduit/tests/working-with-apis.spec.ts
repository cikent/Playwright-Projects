//Import { test, expect } from '@playwright/test';
import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'

/**
* Set up the test environment before each test. Mock the API request for tags and fulfill it with the mock data from tags.json.
 */
test.beforeEach(async ({ page }) => {
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      json: tags
    })
  })

  //Fetch AND then modify the Articles properties to then conduct a verification
  await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch()             
    const responseJSON = await response.json()
    responseJSON.articles[0].title = 'This is a MOCK title for the article'
    responseJSON.articles[0].description = 'This is a MOCK description for the article'
    await route.fulfill({
      json: responseJSON
    })
  })

  // Navigate to the Conduit application before each test
  await page.goto('https://conduit.bondaracademy.com/');
})

/**
* Test to verify the title and tags in the Conduit application. It checks if the navbar brand contains the text 'conduit' and if the sidebar contains the expected tags from the mock data.
*/
test('Has Title', async ({ page }) => {
  await expect(page.locator('.navbar-brand')).toHaveText(/conduit/);
  await expect(page.locator('.sidebar .tag-pill')).toContainText(['Automation', 'Playwright']);
  await expect(page.locator('.preview-link h1').first()).toContainText('This is a MOCK title for the article')
  await expect(page.locator('.preview-link p').first()).toContainText('This is a MOCK description for the article')

});