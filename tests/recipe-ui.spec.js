const { test, expect } = require('@playwright/test');

test.describe('Recipe UI - DummyJSON', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://dummyjson.com/docs/recipes');
  });

  test('deve exibir methodos  da documentação das receitas', async ({ page }) => {
    const titulo = await page.locator('h1.docs-title');
    await expect(titulo).toBeVisible();
    await expect(titulo).toHaveText('Recipes - Docs');
    await expect(page.locator('.display-para')).toContainText('recipes');
    await expect(page.locator('#recipes-all').getByRole('button', { name: 'Show Output' })).toBeVisible();
  });
});