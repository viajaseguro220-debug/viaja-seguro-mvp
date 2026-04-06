# Suite inicial de Playwright

## Objetivo
Cubrir los flujos mas criticos del MVP con una base sencilla y extensible.

## Casos incluidos
- Smoke de autenticacion
- Validacion de panel admin
- Smoke conductor
- Smoke pasajero y ticket condicionado por pago

## Variables requeridas
- E2E_BASE_URL
- E2E_ADMIN_EMAIL
- E2E_ADMIN_PASSWORD
- E2E_DRIVER_EMAIL
- E2E_DRIVER_PASSWORD
- E2E_PASSENGER_EMAIL
- E2E_PASSENGER_PASSWORD
- E2E_PENDING_TICKET_ID

## Comandos
- npm run test:e2e
- npm run test:e2e:ui

## Nota
La suite esta lista a nivel de estructura y casos prioritarios. Necesita instalar `@playwright/test` y, si hace falta, ajustar selectores segun la UI final.