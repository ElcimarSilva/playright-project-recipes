const { test, expect } = require('@playwright/test');

test.describe('Recipes - DummyJSON', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('deve responder no endpoint de receitas (API docs)', async ({ page }) => {
    await page.goto('https://dummyjson.com/docs/recipes');
    await expect(page).toHaveTitle(/DummyJSON/);
  });
});

