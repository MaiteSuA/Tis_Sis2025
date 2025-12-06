import { test, expect } from '@playwright/test';

test('TC-16 - Visualizar listado de evaluaciones', async ({ page }) => {
  
  // 1. Entrar a la app
  await page.goto('http://localhost:5173'); 

  // 2. Click en el nav-link "Iniciar Sesion"
  await page.getByText('Iniciar Sesion', { exact: true }).click();

  // 3. Click en "Responsable de Area"
  await page.getByText('Responsable de Area', { exact: true }).click();

  // 4. Login responsable área
  await page.getByPlaceholder('Usuario').fill('responsable@example.com');
  await page.getByPlaceholder('********').fill('123456')
  await page.click('button:has-text("Ingresar")');

  await page.click('button:has-text("Registrar Evaluador")');

  // Verificar tabla cargada
  const table = page.locator('table.evaluaciones');
  await expect(table).toBeVisible();

  // Verificar columnas
  await expect(page.locator('th:has-text("Competidor")')).toBeVisible();
  await expect(page.locator('th:has-text("Nota")')).toBeVisible();
  await expect(page.locator('th:has-text("Observaciones")')).toBeVisible();
  await expect(page.locator('th:has-text("Estado")')).toBeVisible();
});
