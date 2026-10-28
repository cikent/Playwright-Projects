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

  await page.goto('https://conduit.bondaracademy.com/');
  await expect(page.locator('.navbar-brand')).toHaveText(/conduit/);
  await expect(page.locator('.sidebar .tag-pill')).toContainText(['Automation', 'Playwright']);
  await expect(page.locator('.preview-link h1').first()).toContainText('This is a MOCK title for the article')
  await expect(page.locator('.preview-link p').first()).toContainText('This is a MOCK description for the article')
});

test('Delete Article', async ({ page, request }) => {
  const loginResponse = await request.post('https://conduit-api.bondaracademy.com/api/users/login', {
    data: {
      "user": {
        "email": "ckentTest+christopherikent@gmail.com",
        "password": "ckentTest321"
      }
    }
  })
  expect(loginResponse.status()).toEqual(200)
  const responseLoginJSON = await loginResponse.json()
  const token = responseLoginJSON.user.token
    
  const newArticleResponse = await request.post('https://conduit-api.bondaracademy.com/api/articles', {
    headers: {
      Authorization: 'Token ${token}'
    },
    data: {
      "article": {
        "title": "Test Title",
        "description": "Test Description",
        "body": "Test Body",
        "tagList": []
      }
    }
  })
  expect(newArticleResponse.status()).toEqual(401)

  await page.goto('https://conduit-api.bondaracademy.com');
  await page.getByText('Sign in').click()
  await page.getByRole('textbox', {name: 'Email'}).fill('ckentTest+christopherikent@gmail.com')
  await page.getByRole('textbox', { name: 'Password' }).fill('ckentTest321')
  await page.getByRole('button', { name: ' Sign in '}).click()


  await expect(page.locator('.preview-link h1').first()).toContainText('Test Title')
  await page.getByText('Test Title').click()
  await page.getByRole('button', {name: 'Delete Article'}).first().click()
  await page.waitForResponse('https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0')
  await expect(page.locator('.preview-link h1').first()).not.toContainText('Test Title')
})
