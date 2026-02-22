# Project Rules – Playwright Automation Suite

## Stack
- Playwright (latest stable)
- JavaScript (ES2022+)
- Node.js 18+
- @playwright/test as test runner

## General Principles
- Tests must be deterministic and independent
- No hardcoded waits (never use page.waitForTimeout unless strictly necessary)
- Prefer auto-waiting and Playwright locators
- Code must be clean, readable and production-ready

## Architecture
- Follow Page Object Model (POM)
- Separate:
  - pages/
  - tests/
  - fixtures/
  - utils/
- Reusable components should be extracted
- Avoid duplicated selectors

## Locator Strategy
- Prefer:
  - getByRole
  - getByTestId
  - getByLabel
- Avoid brittle CSS/XPath selectors
- Test IDs must be stable and meaningful

## Test Structure
- One logical scenario per test
- Use test.describe to group scenarios
- Use beforeEach for setup
- No shared state between tests

## Assertions
- Always use Playwright expect
- Prefer:
  - toBeVisible()
  - toHaveText()
  - toHaveURL()
  - toHaveCount()

## Configuration
- Use playwright.config.js
- Enable:
  - retries in CI
  - parallel execution
  - headless in CI
- Use projects for multi-browser testing

## Environment Management
- Use .env for secrets
- Never hardcode credentials
- Use process.env

## Reporting
- Enable HTML reporter
- Enable trace on failure
- Enable screenshots on failure
- Enable video on retry

## CI/CD
- Tests must run in headless mode
- Fail pipeline if any test fails
- Publish reports as artifacts

## Code Style
- Use async/await only
- Avoid nested awaits
- Use descriptive test names
- Keep functions small and focused

## Performance
- Tests should be optimized for speed
- Use test.parallel when possible
- Avoid unnecessary page reloads

## Best Practices
- Prefer fixtures over manual setup
- Reuse login state with storageState
- Keep tests isolated
- Clean test data after execution when needed

## Output Expectation
- Generate production-quality code
- Follow project structure strictly
- Avoid unnecessary comments
- Prioritize maintainability and scalability
