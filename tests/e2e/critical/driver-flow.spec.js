const { test, expect } = require('@playwright/test');
const { login } = require('../helpers/session');

test.describe('Flujo critico de conductor', () => {
  test('DRV-CRIT-001 conductor puede ver accesos clave', async ({ page }) => {
    const email = process.env.E2E_DRIVER_EMAIL;
    const password = process.env.E2E_DRIVER_PASSWORD;

    test.skip(!email || !password, 'Configura E2E_DRIVER_EMAIL y E2E_DRIVER_PASSWORD');

    await login(page, email, password);
    await expect(page.getByRole('link', { name: /mi vehiculo|vehiculo/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /tomar rutas|rutas|mis rutas/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /mis viajes|mis trips|crear viaje/i }).first()).toBeVisible();
  });

  test('DRV-CRIT-002 conductor ve bloqueo de creacion de rutas y flujo alterno', async ({ page }) => {
    const email = process.env.E2E_DRIVER_EMAIL;
    const password = process.env.E2E_DRIVER_PASSWORD;

    test.skip(!email || !password, 'Configura E2E_DRIVER_EMAIL y E2E_DRIVER_PASSWORD');

    await login(page, email, password);
    await page.goto('/dashboard/routes/create');

    await expect(
      page.getByText(/las rutas base son definidas por administracion|como conductor no necesitas crear rutas/i).first()
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /ver rutas publicadas/i })).toBeVisible();
  });
});
