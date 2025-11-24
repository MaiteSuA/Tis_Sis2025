import { test, expect } from '@playwright/test';

test('TC-18 - Validación de campos vacíos al registrar evaluador', async ({ page }) => {
  
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

  await page.click('button:has-text("Guardar")');

  // Verificar mensajes de error
  const requiredInputs = [
    'input[name="nombres"]'
  ];

  for (const selector of requiredInputs) {
    const input = page.locator(selector);
    const isValid = await input.evaluate((el) => el.checkValidity());
    expect(isValid).toBe(false);
  }

  // Modal NO debe cerrarse
  await expect(page.locator('.modal-registrar-evaluador')).toBeVisible();
});
