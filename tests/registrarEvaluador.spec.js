import { test, expect } from '@playwright/test';

test('TC-17 - Registrar nuevo evaluador', async ({ page }) => {
  
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

  await page.fill('input[name="nombres"]', 'Juan');
  await page.fill('input[name="apellidos"]', 'Pérez López');
  await page.fill('input[name="telefono"]', '76451234');
  await page.fill('input[name="carnet"]', '7896543');
  await page.fill('input[name="correo"]', 'juan.perez@example.com');
  await page.selectOption('select[name="area"]', 'Física');

  await page.click('button:has-text("Guardar")');

  // Validación
  await expect(page.locator('.toast-success')).toContainText('registrado');
});
