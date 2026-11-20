import { test, expect } from '@playwright/test';
import tags from '../test-data/tags.json'

test('Has Title', async ({ page }) => {
  await page.route('*/**/api/tags', async route => {
    await route.fulfill({
      json: tags
    })
  })

  await page.route('*/**/api/articles*', async route => {
    const response = await route.fetch()
    const responseJSON = await response.json()
    responseJSON.articles[0].title = 'This is a MOCK title for the article'
    responseJSON.articles[0].description = 'This is a MOCK description for the article'
    await route.fulfill({
      json: responseJSON
    })
  })

  await page.goto('https://conduit.bondaracademy.com/');              // Navigate to the Conduit application.
  await expect(page.locator('.navbar-brand')).toHaveText(/conduit/);        // Verify that the Conduit logo is displayed.
  await expect(page.locator('.sidebar .tag-pill')).toContainText(['Automation', 'Playwright']);        // Verify that the tags are displayed in the sidebar.
  await expect(page.locator('.preview-link h1').first()).toContainText('This is a MOCK title for the article')        // Verify that the article title is displayed.
  await expect(page.locator('.preview-link p').first()).toContainText('This is a MOCK description for the article')        // Verify that the article description is displayed.
});

test('Delete Article', async ({ page, request }) => {
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

  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles/', {
    headers: {
      'Authorization': `Token ${token}`     // Add the authorization token to the request headers.
    },
    data: {                     // Add the article data to the request body.
      "article": {
        "title": "Test Title",
        "description": "Test Description",
        "body": "Test Body",
        "tagList": []
      }
    }
  })
  expect(newArticleResponse.status()).toEqual(201)    // Verify that the article was created successfully. 

  await page.goto('https://conduit.bondaracademy.com/');        // Navigate to the Conduit application.

  await expect(page.locator('.preview-link h1').first()).toContainText(/Test Title|Playwright is awesome/) // Verify that the article is displayed on the page.
  await page.getByText('Test Title').click()                                          // Open the article.
  await page.getByRole('button', { name: 'Delete Article' }).first().click()            // Delete the article.
  await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0') // Wait for the articles list to be fetched.
  await expect(page.locator('.preview-link h1').first()).not.toContainText('Test Title') // Verify that the article is no longer displayed on the page.
})

test('Create Article', async ({ page, request }) => {
  await page.goto('https://conduit.bondaracademy.com/');              // Navigate to the Conduit application.                               

  await page.getByText('New Article').click()
  await page.getByRole('textbox', { name: 'Article Title' }).fill('Playwright is awesome')    //  Fill in the article title.      
  await page.getByRole('textbox', { name: 'What\'s this article about?' }).fill('We can use APIs in Playwright')  // Fill in the article description.
  await page.getByRole('textbox', { name: 'Write your article (in markdown)' }).fill('Automate any web application in Playwright') // Fill in the article body.
  await page.getByRole('button', { name: 'Publish Article' }).click()      // Click the Publish Article button.

  const createArticleResponse = await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles/') // Wait for the articles list to be fetched.
  const articleResponseJSON = await createArticleResponse.json()  // Parse the response JSON to extract the article slug.
  const slugID = articleResponseJSON.article.slug                 // Extract the article slug from the response.

  await expect(page.locator('.article-page h1')).toContainText('Playwright is awesome') // Verify that the article is displayed on the page.
  await page.getByText('Home').first().click() // Navigate back to the home page.
  await expect(page.locator('.article-preview h1').first()).toContainText('Playwright is awesome') // Verify that the article is displayed on the home page.

  const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user": {
        "email": "ckentTest+christopherikent@gmail.com",
        "password": "ckentTest321"
      }
    }
  })
  expect(loginResponse.status()).toEqual(200)           // Verify that the user logged in successfully.
  const responseLoginJSON = await loginResponse.json()  // Parse the login response JSON to extract the token.
  const token = responseLoginJSON.user.token            // Extract the token from the login response.

  const deleteResponse = await request.delete(`https://conduit-api.bondaracademy.com/api/articles/${slugID}`, {
    headers: {    // Add the authorization token to the request headers.
      Authorization: `Token ${token}`
    }
  })
  expect(deleteResponse.status()).toEqual(204)         // Verify that the article was deleted successfully.

})