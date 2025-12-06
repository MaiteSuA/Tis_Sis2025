import { test, expect } from '@playwright/test';

test('TC-21 - Abrir modal Registrar Evaluador', async ({ page }) => {
  
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

  const modal = page.locator('.modal-registrar-evaluador');
  await expect(modal).toBeVisible();

  // Verificar campos
  await expect(page.locator('input[name="nombres"]')).toBeVisible();
  await expect(page.locator('input[name="apellidos"]')).toBeVisible();
  await expect(page.locator('input[name="carnet"]')).toBeVisible();
  await expect(page.locator('input[name="correo"]')).toBeVisible();
  await expect(page.locator('input[name="telefono"]')).toBeVisible();
  await expect(page.locator('select[name="area"]')).toBeVisible();
  await expect(page.locator('input[name="rol"]')).toHaveValue('EVALUADOR');
});