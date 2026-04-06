const fallbackCompanyName = 'VIAJA SEGURO';

function cleanEnv(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export const APP_COMPANY_NAME = cleanEnv(process.env.NEXT_PUBLIC_COMPANY_NAME) ?? fallbackCompanyName;
export const APP_SUPPORT_EMAIL = cleanEnv(process.env.NEXT_PUBLIC_SUPPORT_EMAIL);
export const APP_SUPPORT_WHATSAPP = cleanEnv(process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP);
export const APP_DEFAULT_CURRENCY = cleanEnv(process.env.NEXT_PUBLIC_DEFAULT_CURRENCY) ?? 'MXN';
export const APP_DEFAULT_LOCALE = cleanEnv(process.env.NEXT_PUBLIC_DEFAULT_LOCALE) ?? 'es-MX';

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat(APP_DEFAULT_LOCALE, {
    style: 'currency',
    currency: APP_DEFAULT_CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatShortDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return new Intl.DateTimeFormat(APP_DEFAULT_LOCALE).format(date);
}
