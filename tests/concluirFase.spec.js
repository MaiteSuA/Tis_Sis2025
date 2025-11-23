import { test, expect } from '@playwright/test';

test('TC-20 - Concluir Fase', async ({ page }) => {
  
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


  await page.click('button:has-text("Concluir Fase")');

  // Mensaje de confirmación
  await expect(page.locator('.modal-confirmacion')).toBeVisible();

  await page.click('button:has-text("Confirmar")');

  // Validaciones
  await expect(page.locator('.toast-success')).toContainText('Fase concluida');
  await expect(page.locator('.estado-fase')).toHaveText(/Concluida/i);
});
