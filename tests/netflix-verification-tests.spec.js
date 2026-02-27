const { test, expect } = require('@playwright/test');

test.describe('Netflix Verification Tests', () => {


test('should verify the error message on invalid login', async ({ page }) => {
    await page.goto('https://www.netflix.com');

    const login = await page.getByRole('link', { name: 'Sign In' })
    await login.click();

    const emailInput = await page.locator('[name="userLoginId"]');
    await emailInput.fill('invalid-email');
    await page.locator('[data-uia="continue-button"]').click();

    const error = await page.locator('[data-uia="field-userLoginId+validationMessage"]');
    await expect(error).toContainText('Please enter a valid email.');
});
});


//open page
//click on sign in
//put invalid email
//click continue
//verify error message