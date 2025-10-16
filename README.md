# Playwright-Projects

Various projects utilizing Playwright as the primary open source tool

## Initial Setup

* Navigate to //Playwright-Projects/PlaywrightDemoApps/ to view Playwright Test Applications I've created
* To create a new Playwright Test Application, create a new folder AND cd into that directory, then proceed with the following instructions

## Playwright Terminal Commands

### [Installing Playwright](https://playwright.dev/docs/intro#installing-playwright)

The command below either initializes a new project or adds Playwright to an existing one.

```shell
npm init playwright@latest
```

When prompted, choose / confirm:

* TypeScript or JavaScript (default: TypeScript)
* Tests folder name (default: tests, or e2e if tests already exists)
* Add a GitHub Actions workflow (recommended for CI)
* Install Playwright browsers (default: yes)

You can re-run the command later; it does not overwrite existing tests.

### [Running the Example Test](https://playwright.dev/docs/intro#running-the-example-test)

By default tests run headless in parallel across Chromium, Firefox and WebKit (configurable in playwright.config). Output and aggregated results display in the terminal.

```shell
npx playwright test
```

### [HTML Test Reports](https://playwright.dev/docs/intro#html-test-reports)

After a test run, the HTML Reporter provides a dashboard filterable by the browser, passed, failed, skipped, flaky and more. Click a test to inspect errors, attachments and steps. It auto-opens only when failures occur; open manually with the command below.

```shell
npx playwright show-report
```

### [Running the Example Test in UI Mode](https://playwright.dev/docs/intro#running-the-example-test-in-ui-mode)

Run tests with UI Mode for watch mode, live step view, time travel debugging and more.

```shell
npx playwright test --ui
```
