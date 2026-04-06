# Plan de Pruebas por Sprint - VIAJA SEGURO

## Objetivo
Dejar una secuencia realista de validacion que priorice riesgo operativo, continuidad de negocio y pruebas automatizables.

---

## Sprint 0 - Estabilizacion del entorno

### Meta
Poder levantar el proyecto y ejecutar smoke tests repetibles.

### Alcance
- Validar `npm run dev`
- Validar frontend y backend compilan
- Validar Prisma schema y cliente alineados
- Detectar locks de SQLite y problemas de OneDrive
- Confirmar healthcheck, login y dashboard

### Casos prioridad alta
- OPS-001
- AUTH-001
- AUTH-002
- AUTH-004
- DB-001
- DB-002

### Criterio de salida
- Web y API levantan localmente
- No hay errores de TypeScript
- No hay archivos frontend con UTF-8 invalido
- Existe checklist de recovery para el equipo

---

## Sprint 1 - Flujo conductor

### Meta
Asegurar que el conductor pueda operar de principio a fin sin callejones.

### Alcance
- Verificacion de conductor
- Registro y aprobacion de vehiculo
- Creacion y administracion de rutas
- Creacion de trips
- Visualizacion de reservas por trip
- Validacion de abordaje

### Casos prioridad alta
- VER-003
- VEH-001
- VEH-002
- VEH-003
- ROU-001
- ROU-002
- ROU-003
- TRI-001
- TRI-002
- TRI-004
- PAY-005

### Casos prioridad media
- TRI-003
- ADM-002

### Criterio de salida
- Conductor approved + vehiculo approved puede crear ruta y trip
- No puede operar si verification o vehicle no estan approved
- Boarding bloquea pagos no aprobados

---

## Sprint 2 - Flujo pasajero y pagos manuales

### Meta
Validar el recorrido del pasajero desde busqueda hasta ticket habilitado.

### Alcance
- Registro y login pasajero
- Verificacion documental pasajero
- Busqueda de trips
- Reserva de asientos
- Creacion de payment
- Subida de comprobante
- Ticket condicionado por aprobacion de pago

### Casos prioridad alta
- REG-001
- VER-001
- VER-002
- RES-001
- RES-002
- RES-004
- PAY-001
- PAY-002
- PAY-006
- PAY-007
- PAY-008

### Casos prioridad media
- AUTH-003
- PAY-004

### Criterio de salida
- Pasajero no verificado no reserva
- Reserva genera payment
- Ticket solo muestra QR y codigo cuando payment approved
- Comprobante se puede reenviar si fue rechazado

---

## Sprint 3 - Panel admin operativo

### Meta
Asegurar que admin pueda operar revisiones, pagos y supervision del sistema.

### Alcance
- Aprobar y rechazar usuarios
- Aprobar y rechazar vehiculos
- Aprobar y rechazar pagos manuales
- Revisar trips y reservations
- Crear rutas desde admin si aplica
- Crear refunds manuales
- Generar payouts semanales

### Casos prioridad alta
- VER-003
- VER-004
- VEH-003
- PAY-003
- PAY-004
- ADM-001
- ADM-003
- REF-001
- REF-002
- PYO-001

### Casos prioridad media
- PYO-002
- ADM-002

### Criterio de salida
- Admin puede resolver pagos y verificaciones sin inconsistencias
- Refunds no se duplican
- Payouts reflejan pagos y refunds correctamente

---

## Sprint 4 - Seguridad, concurrencia e integraciones

### Meta
Romper el sistema antes de que lo haga un usuario real.

### Alcance
- Ownership por rol
- IDOR
- XSS e inputs maliciosos
- Concurrencia de reservas
- Webhooks duplicados y fuera de orden
- Estres sobre dashboards y reservas

### Casos prioridad alta
- SEC-001
- SEC-002
- SEC-003
- SEC-004
- RES-003
- PERF-001
- WEB-001
- WEB-002

### Casos prioridad media
- PERF-002

### Criterio de salida
- No hay sobreventa
- No hay acceso indebido entre roles
- Webhooks no corrompen estados
- El sistema resiste carga razonable de staging

---

## Recomendacion de ejecucion

### Diario
- Smoke local
- Login por rol
- Healthcheck API
- Dashboard por rol

### Antes de demo
- Flujo conductor completo
- Flujo pasajero completo
- Pago manual aprobado por admin
- Ticket y boarding

### Antes de piloto
- Suite e2e critica
- Pruebas de concurrencia
- Pruebas de seguridad basicas
- Auditoria de integridad en DB

---

## Riesgos a monitorear por sprint

| Sprint | Riesgo principal | Mitigacion |
|---|---|---|
| 0 | Entorno local inestable | Checklist de recovery y limpieza de procesos |
| 1 | Bloqueos operativos mal aplicados | Casos negativos por role/verification/vehicle |
| 2 | Inconsistencia payment vs reservation | Casos de rechazo, reenvio y ticket condicionado |
| 3 | Error humano de admin | Mensajes claros, notas, regresiones y auditoria |
| 4 | Sobreventa y estados corruptos | Concurrencia, webhook idempotente y pruebas de carga |