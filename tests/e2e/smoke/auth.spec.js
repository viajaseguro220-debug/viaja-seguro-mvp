const { test, expect } = require('@playwright/test');
const { login } = require('../helpers/session');

test.describe('Smoke de autenticacion', () => {
  test('AUTH-001 login de admin valido', async ({ page }) => {
    const email = process.env.E2E_ADMIN_EMAIL;
    const password = process.env.E2E_ADMIN_PASSWORD;

    test.skip(!email || !password, 'Configura E2E_ADMIN_EMAIL y E2E_ADMIN_PASSWORD');

    await login(page, email, password);
    await expect(page.getByText(/panel operativo|admin|verificaciones/i).first()).toBeVisible();
  });

  test('AUTH-002 login invalido muestra error', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/correo/i).fill('no-existe@viajaseguro.test');
    await page.getByLabel(/contrasena|contraseña/i).fill('incorrecta123');
    await page.getByRole('button', { name: /entrar|iniciar/i }).click();
    await expect(page.getByText(/no se pudo|error|credenciales|inval/i).first()).toBeVisible();
  });
});