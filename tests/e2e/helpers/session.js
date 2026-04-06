const { expect } = require('@playwright/test');

async function login(page, email, password) {
  await page.goto('/login');
  await page.getByLabel(/correo/i).fill(email);
  await page.getByLabel(/contrasena|contraseña/i).fill(password);
  await page.getByRole('button', { name: /entrar|iniciar/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

async function openDashboard(page) {
  await page.goto('/dashboard');
  await expect(page.getByText(/panel|dashboard|verificacion|verificación/i).first()).toBeVisible();
}

module.exports = {
  login,
  openDashboard
};