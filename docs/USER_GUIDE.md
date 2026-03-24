# FieldCore - Guía de Usuario

**Versión:** 1.0.0  
**Fecha:** Marzo 2026  
**Público Objetivo:** Directivos, Supervisores, Clientes Potenciales  

---

## Tabla de Contenidos

1. [¿Qué es FieldCore?](#1-qué-es-fieldcore)
2. [Qué Problema Resuelve](#2-qué-problema-resuelve)
3. [Perfiles de Usuario](#3-perfiles-de-usuario)
4. [Flujo Operativo Completo](#4-flujo-operativo-completo)
5. [Gestión de Clientes](#5-gestión-de-clientes)
6. [Gestión de Órdenes de Servicio](#6-gestión-de-órdenes-de-servicio)
7. [Asignación de Técnicos](#7-asignación-de-técnicos)
8. [Captura de Evidencia](#8-captura-de-evidencia)
9. [Seguimiento y Trazabilidad](#9-seguimiento-y-trazabilidad)
10. [Dashboard y Reportes](#10-dashboard-y-reportes)
11. [Beneficios Operativos](#11-beneficios-operativos)
12. [Alcance del MVP](#12-alcance-del-mvp)
13. [Próximas Evoluciones](#13-próximas-evoluciones)

---

## 1. ¿Qué es FieldCore?

### 1.1 Definición del Producto

**FieldCore** es una plataformaSaaS (Software como Servicio) diseñada específicamente para empresas en México y Latinoamérica que ofrecen servicios en campo: reparaciones, instalaciones, mantenimiento, entregas y cualquier actividad que requiera que un técnico visite la ubicación del cliente.

### 1.2 En Síntesis

| Aspecto | Descripción |
|---------|-------------|
| **¿Qué es?** | Plataforma de gestión de operaciones en campo |
| **¿Para quién?** | Empresas de servicios con técnicos en terreno |
| **¿Qué hace?** | Planea, asigna, ejecuta y documenta servicios |
| **¿Dónde se usa?** | Cualquier dispositivo con navegador web |
| **¿Necesita instalación?** | No - Es cloud, se accede desde cualquier lugar |
| **¿Qué idioma?** | Español (configurable) |

### 1.3 Lo que FieldCore NO es

- ❌ No es un sistema de facturación (integrable con uno)
- ❌ No es GPS de vehículos (compatible con integraciones futuras)
- ❌ No es CRM de ventas (enfocado en ejecución, no en prospección)
- ❌ No es app móvil standalone (optimizado para web móvil)

---

## 2. Qué Problema Resuelve

### 2.1 El Desafío de las Empresas de Servicios

Imagine una empresa con **20 técnicos** atendiendo **200 clientes** diarios. Sin un sistema especializado:

```
ESCENARIO SIN FIELDCORE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ Supervisor no sabe dónde están sus técnicos
❌ Cliente llama a preguntar por su servicio - nadie sabe nada
❌ Técnico llega a la ubicación y no tiene los datos correctos
❌ Se completa el servicio pero no hay evidencia
❌ Al final del mes: ¿cuántos servicios hicimos? ¿cuántos en tiempo?
❌ El técnico dice que llegó, el cliente dice que no vino
❌ Facturación basada en "palabra de técnico"
❌ Reportes tardan días en prepararse

RESULTADO: Incertidumbre, retrabajo, peleas con clientes, pérdidas económicas
```

### 2.2 La Solución FieldCore

```
ESCENARIO CON FIELDCORE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Supervisor ve en tiempo real estado de todas las órdenes
✅ Cliente recibe actualizaciones automáticas
✅ Técnico tiene toda la info en su dispositivo móvil
✅ Evidencia fotográfica y firma digital de cada servicio
✅ Dashboard muestra métricas al instante
✅ Geolocalización registra llegada del técnico
✅ Facturación con respaldo documental completo
✅ Reportes listos con un clic

RESULTADO: Control total, clientes satisfechos, facturación precisa, crecimiento medible
```

### 2.3 Métricas que Transforman

| Antes de FieldCore | Después de FieldCore |
|--------------------|---------------------|
| No se medía tiempo de servicio | Tiempo promedio por tipo de servicio |
| "No sé dónde están mis técnicos" | Ubicación en tiempo real |
| Incumplimiento del 30% en SLAs | Cumplimiento medido y mejorado |
| Reportes manuales cada fin de mes | Dashboard en tiempo real |
| Conflictos por evidencias | Evidencia documentada e inmutable |

---

## 3. Perfiles de Usuario

### 3.1 Resumen de Roles

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROLES EN FIELDCORE                           │
├─────────────────┬───────────────────────────────────────────────┤
│    ROL          │         ¿QUÉ HACE?                            │
├─────────────────┼───────────────────────────────────────────────┤
│ Administrador   │ Configura la empresa, usuarios y límites       │
│ Supervisor      │ Coordina técnicos, asigna órdenes             │
│ Técnico         │ Ejecuta los servicios en campo                 │
│ Cliente Final   │ Recibe el servicio (interacción mínima)       │
└─────────────────┴───────────────────────────────────────────────┘
```

### 3.2 Administrador

**¿Quién es?**  
El dueño, director de operaciones o IT de la empresa.

**¿Qué puede hacer?**

| Función | Descripción |
|---------|-------------|
| Gestionar usuarios | Crear, editar, desactivar cuentas de supervisores y técnicos |
| Configurar organización | Nombre, logo, datos fiscales, settings |
| Definir planes de servicio | Tipos de servicio, tiempos estándar, prioridades |
| Ver métricas generales | Dashboard ejecutivo, ingresos por período |
| Gestionar límites | Cuántos usuarios, técnicos, órdenes según su plan |
| Configurar integraciones | (Futuro) API con sistemas de facturación |

**Ejemplo de uso diario:**
> "Necesito crear 3 cuentas nuevas para los técnicos que contratamos la semana pasada. También quiero revisar cuántos servicios hicimos en marzo vs febrero."

### 3.3 Supervisor

**¿Quién es?**  
El coordinador de campo, jefe de servicio al cliente o líder de equipo.

**¿Qué puede hacer?**

| Función | Descripción |
|---------|-------------|
| Crear órdenes de servicio | Registrar solicitudes de clientes |
| Asignar técnicos | Decidir quién atiende cada orden |
| Reasignar órdenes | Cambiar técnico si es necesario |
| Monitorear equipos | Ver estado de técnicos y órdenes activas |
| Gestionar clientes | CRUD de clientes de su organización |
| Revisar evidencias | Ver fotos y firmas de servicios completados |
| Generar reportes | Exportar información para análisis |

**Ejemplo de uso diario:**
> "Hoy tengo 15 órdenes pendientes. Voy a asignar a Juan con 5 órdenes cerca de Polanco, a María con 4 en Condesa y a Roberto con 6 en Santa Fe. Luego reviso cómo van los servicios de la mañana."

### 3.4 Técnico

**¿Quién es?**  
El profesional de campo: técnico de reparaciones, instalador, técnico de mantenimiento.

**¿Qué puede hacer?**

| Función | Descripción |
|---------|-------------|
| Ver sus órdenes | Lista de servicios asignados para el día |
| Iniciar servicio | Marcar cuando llega y comienza el trabajo |
| Capturar evidencia | Tomar fotos, registrar firma del cliente |
| Completar servicio | Marcar como terminado, agregar notas |
| Ver historial | Acceder a servicios previos del cliente |
| Actualizar perfil | Cambiar teléfono, disponibilidad |

**Ejemplo de uso diario:**
> "Llego al cliente, abro la orden, marco 'Iniciar servicio'. Tomo foto del equipo antes. Hago el trabajo. Tomo foto después. El cliente firma en la tablet. Marco 'Completar'. Listo, siguiente orden."

### 3.5 Cliente Final (Interacción Indirecta)

**¿Quién es?**  
El destinatario final del servicio: persona en una casa, empleado en una empresa.

**¿Cómo interactúa con FieldCore?**

| Interacción | Descripción |
|-------------|-------------|
| Recibe notificación | (Futuro) SMS o correo con fecha y técnico asignado |
| Firma digital | Apoya en la tablet del técnico al aceptar el servicio |
| Califica servicio | (Futuro) Encuesta breve después del servicio |
| Da feedback | (Futuro) Comentarios sobre la experiencia |

**Nota importante:** El cliente final no necesita登录 FieldCore. Su interacción es mínima y guiada por el técnico.

---

## 4. Flujo Operativo Completo

### 4.1 El Ciclo de Vida de una Orden

Cada orden de servicio pasa por estados claramente definidos:

```
═══════════════════════════════════════════════════════════════════
                        CICLO DE VIDA DE UNA ORDEN
═══════════════════════════════════════════════════════════════════

    ┌──────────┐
    │ PENDIENTE │  ← Orden creada, esperando asignación
    └────┬─────┘
         │ Asignar técnico
         ▼
    ┌──────────┐
    │ ASIGNADA  │  ← Técnico knows about it, scheduled
    └────┬─────┘
         │ Técnico inicia servicio
         ▼
    ┌─────────────┐
    │EN PROCESO   │  ← Técnico en lokasi, trabajando
    └────┬────────┘
         │ Técnico completa trabajo
         ▼
    ┌───────────┐
    │COMPLETADA │  ← Trabajo hecho, pendiente cerrar
    └────┬──────┘
         │ Supervisor cierra orden
         ▼
    ┌────────┐
    │ CERRADA│  ← Orden finalizada, lista para facturación
    └────────┘

    Alternativas:
    ─────────────────────────────────
    • PENDIENTE → CANCELADA (cliente cancela)
    • ASIGNADA → CANCELADA (cambio de planes)
    • ASIGNADA → REASIGNADA (técnico no disponible)
```

### 4.2 Paso a Paso: El Viaje de una Orden

**ESCENARIO:** Cliente "Telecom MX" necesita instalación de internet en sus oficinas.

---

**PASO 1: Creación de la Orden**

```
👤 Actor: Supervisor
📍 Ubicación: Oficina (web)
⏱️ Tiempo: 3 minutos

Acciones:
1. Supervisor inicia sesión en FieldCore
2. Selecciona "Nueva Orden de Servicio"
3. Busca y selecciona cliente "Telecom MX"
4. Completa información:
   - Servicio: Instalación internet corporativo
   - Prioridad: Alta (cliente VIP)
   - Fecha: 25 de Marzo, 9:00 AM
   - Notas: Necesitan cableado en piso 3
5. Guarda orden
6. Sistema asigna número: OS-2026-0342

Resultado: Orden creada en estado PENDIENTE
```

---

**PASO 2: Asignación de Técnico**

```
👤 Actor: Supervisor
📍 Ubicación: Oficina (web)
⏱️ Tiempo: 1 minuto

Acciones:
1. Supervisor abre la orden OS-2026-0342
2. Ve técnicos disponibles:
   - Juan Pérez: 3 órdenes hoy, cerca de Polanco
   - María López: 5 órdenes hoy, en Santa Fe
   - Roberto Sánchez: 2 órdenes hoy, cerca de Polanco ✓
3. Asigna a Roberto Sánchez
4. Sistema notifica a Roberto (configurable)

Resultado: Orden pasa a estado ASIGNADA
```

---

**PASO 3: Preparación del Técnico**

```
👤 Actor: Roberto (Técnico)
📍 Ubicación: Su vehículo / Casa
⏱️ Tiempo: 5 minutos (la noche anterior o esa mañana)

Acciones:
1. Roberto revisa sus órdenes del día en FieldCore
2. Ve detalles de OS-2026-0342:
   - Cliente: Telecom MX
   - Dirección: Av. Insurgentes 1000, Piso 3
   - Contacto: Ing. Carlos Mendoza, 55-1234-5678
   - Servicio: Instalación internet
   - Notas: Solicitar acceso a piso 3
3. Prepara herramientas y materiales necesarios
4. Planea ruta (futuro: GPS integrado)

Resultado: Técnico preparado con información completa
```

---

**PASO 4: Inicio del Servicio**

```
👤 Actor: Roberto (Técnico)
📍 Ubicación: Cliente Telecom MX
⏱️ Tiempo: Al llegar al lokasi

Acciones:
1. Roberto llega a la dirección
2. Abre la orden en su dispositivo
3. Marca "Iniciar Servicio"
4. Sistema registra:
   - Fecha/hora de llegada
   - Ubicación GPS (longitud/latitud)
   - Estado: EN PROCESO

Resultado: Auditoría de llegada, inicio del SLA
```

---

**PASO 5: Ejecución y Captura de Evidencia**

```
👤 Actor: Roberto (Técnico)
📍 Ubicación: Cliente Telecom MX, Piso 3
⏱️ Tiempo: 2-4 horas (según complejidad)

Acciones:
1. Roberto realiza el trabajo:
   - Instala cableado
   - Configura equipos
   - Prueba conectividad
   
2. Documenta con fotos:
   - Foto 1: Equipo antes de instalación
   - Foto 2: Cableado realizado
   - Foto 3: Equipos instalados
   - Foto 4: Prueba de conectividad (speedtest)

3. Si hay incidencias, agrega notas:
   "Cliente solicitó punto adicional en sala de juntas"
   
4. Todo queda registrado con marca de tiempo y ubicación

Resultado: Servicio documentado con evidencia
```

---

**PASO 6: Firma del Cliente**

```
👤 Actor: Roberto + Ing. Carlos Mendoza (Cliente)
📍 Ubicación: Cliente Telecom MX, Piso 3
⏱️ Tiempo: 5 minutos

Acciones:
1. Roberto muestra al cliente el trabajo realizado
2. En FieldCore, presenta la pantalla de firma
3. Cliente firma digitalmente en la tablet:
   "Servicio Instalación Internet Corporativo - Completado"
4. Roberto captura la firma
5. Opcional: Cliente califica servicio (1-5 estrellas)

Resultado: Aceptación documentada del cliente
```

---

**PASO 7: Cierre de la Orden**

```
👤 Actor: Roberto (Técnico)
📍 Ubicación: Cliente Telecom MX
⏱️ Tiempo: 2 minutos

Acciones:
1. Roberto revisa que todo esté completo:
   ✓ Fotos adjuntadas
   ✓ Firma del cliente
   ✓ Notas registradas
2. Marca "Completar Servicio"
3. Sistema calcula:
   - Tiempo real del servicio
   - Cumplimiento del SLA
4. Orden pasa a estado COMPLETADA
5. Notificación a supervisor (si está configurado)

Resultado: Orden lista para cierre administrativo
```

---

**PASO 8: Cierre Definitivo**

```
👤 Actor: Supervisor
📍 Ubicación: Oficina (web)
⏱️ Tiempo: 1 minuto (puede ser masivo)

Acciones:
1. Supervisor revisa órdenes completadas del día
2. Verifica que OS-2026-0342 tenga:
   ✓ Evidencias correctas
   ✓ Firma válida
   ✓ Tiempos adecuados
3. Marca "Cerrar Orden"
4. Sistema:
   - Calcula métricas finales
   - Prepara datos para facturación
   - Actualiza dashboard

Resultado: Orden en estado CERRADA, lista para facturar
```

---

### 4.3 Impacto en Tiempo Real

```
DASHBOARD DEL SUPERVISOR (Ejemplo):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hoy: 25 de Marzo 2026              Total órdenes: 47

┌─────────────────────────────────────────────────────────────────┐
│  ESTADO                    │ CANTIDAD │ %    │ TENDENCIA       │
├───────────────────────────┼──────────┼──────┼─────────────────┤
│ ● En Proceso              │     12   │ 26%  │ ████████░░░░░░  │
│ ● Pendientes              │      8   │ 17%  │ █████░░░░░░░░░  │
│ ● Completadas             │     24   │ 51%  │ ████████████████ │
│ ● Cerradas                │     22   │ 47%  │ ████████████░░░░ │
│ ○ Canceladas              │      3   │  6%  │ █░░░░░░░░░░░░░░  │
└───────────────────────────┴──────────┴──────┴─────────────────┘

SLA CUMPLIMIENTO: 94%  ████████████████████░░
Meta: 90%

ÚLTIMAS 5 ÓRDENES COMPLETADAS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OS-2026-0341  ✓ Juan Pérez    45 min  ⭐⭐⭐⭐⭐
OS-2026-0340  ✓ María López  62 min  ⭐⭐⭐⭐
OS-2026-0339  ✓ Roberto S.   38 min  ⭐⭐⭐⭐⭐
OS-2026-0338  ✓ Juan Pérez   55 min  ⭐⭐⭐⭐
OS-2026-0337  ✓ María López  41 min  ⭐⭐⭐⭐⭐

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 5. Gestión de Clientes

### 5.1 ¿Qué es un Cliente en FieldCore?

Un **Cliente** es la empresa o persona que recibe los servicios. FieldCore almacena:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Nombre** | Razón social o nombre completo | "Telecom MX, S.A. de C.V." |
| **Correo** | Email principal de contacto | contact@telecom.mx |
| **Teléfono** | Teléfono principal | (55) 1234-5678 |
| **Dirección** | Dirección fiscal o de servicio | "Av. Insurgentes 1000, Piso 3" |
| **Coordenadas** | Latitud/Longitud para mapa | 19.4326, -99.1332 |
| **Notas** | Información adicional | "Solicitar acceso en recepción" |

### 5.2 CRUD de Clientes

**CREAR Cliente:**

```
1. Ir a Menú → Clientes
2. Click en "Nuevo Cliente"
3. Completar formulario
4. Guardar

Resultado: Cliente disponible para crear órdenes
```

**EDITAR Cliente:**

```
1. Ir a Clientes
2. Buscar cliente (nombre, RFC, etc.)
3. Click en el cliente
4. Modificar campos necesarios
5. Guardar cambios

Resultado: Información actualizada
```

**CONSULTAR Cliente:**

```
1. Ir a Clientes
2. Ver lista con filtros:
   - Activos/Inactivos
   - Buscar por nombre
   - Ordenar por última orden
3. Click para ver detalle:
   - Información completa
   - Historial de órdenes
   - Estadísticas de servicio

Resultado: Vista completa del cliente
```

**ELIMINAR Cliente:**

```
1. Ir a cliente específico
2. Click en "Desactivar" (no eliminación física)
3. Confirmar acción

Resultado: Cliente oculto de listas activas
         (Historial preservado para auditoría)
```

### 5.3 Vista de Detalle del Cliente

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENTE: TELECOM MX                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📋 INFORMACIÓN GENERAL                                         │
│  ─────────────────────────────────────────────────────────────  │
│  Nombre:        Telecom MX, S.A. de C.V.                       │
│  RFC:           TME920123ABC                                    │
│  Email:         contact@telecom.mx                              │
│  Teléfono:      (55) 1234-5678                                  │
│                                                                 │
│  📍 DIRECCIÓN                                                   │
│  ─────────────────────────────────────────────────────────────  │
│  Dirección:     Av. Insurgentes Sur 1000, Piso 3                │
│  Colonia:        Col. Del Valle                                  │
│  Ciudad:        Ciudad de México                               │
│  CP:            03100                                          │
│                                                                 │
│  📊 ESTADÍSTICAS                                               │
│  ─────────────────────────────────────────────────────────────  │
│  Órdenes totales:      127                                      │
│  Órdenes este mes:     12                                      │
│  Servicios completados: 118 (93%)                               │
│  Tiempo promedio:       52 minutos                              │
│  Satisfacción promedio: ⭐⭐⭐⭐ (4.2/5)                         │
│                                                                 │
│  📝 NOTAS                                                       │
│  ─────────────────────────────────────────────────────────────  │
│  Cliente VIP. Solicitar acceso en recepción. Atn: Ing. Mendoza   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ÚLTIMAS 5 ÓRDENES                                       │   │
│  ├─────────────────────────────────────────────────────────┤   │
│  │ OS-2026-0342  Instalación  ⏱️ En Proceso    📅 Hoy     │   │
│  │ OS-2026-0298  Mantenimiento ✓ Completada    📅 15/Mar   │   │
│  │ OS-2026-0251  Reparación    ✓ Completada    📅 28/Feb  │   │
│  │ OS-2026-0203  Instalación    ✓ Completada    📅 10/Feb  │   │
│  │ OS-2026-0155  Diagnóstico    ✓ Completada    📅 25/Ene  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [ Editar Cliente ]                    [ Ver Todas las Órdenes ]│
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Gestión de Órdenes de Servicio

### 6.1 Concepto de Orden de Servicio

Una **Orden de Servicio** es la representación digital de un trabajo a realizar. Contiene:

| Campo | Descripción | Ejemplo |
|-------|-------------|---------|
| **Número** | Identificador único | OS-2026-0342 |
| **Cliente** | A quién se le presta el servicio | Telecom MX |
| **Título** | Descripción corta | Instalación internet corporativo |
| **Descripción** | Detalle completo del servicio | Instalación de red... |
| **Prioridad** | Urgencia del servicio | Alta |
| **Estado** | Posición en el ciclo de vida | Pendiente |
| **Técnico** | Persona asignada | Roberto Sánchez |
| **Fecha Programada** | Cuándo se debe realizar | 25/Mar/2026 9:00 |
| **Fecha Real** | Cuándo se realizó | - |

### 6.2 Estados de la Orden

| Estado | Color | Significado |
|--------|-------|-------------|
| **Pendiente** | Naranja | Creada, esperando asignación |
| **Asignada** | Azul | Técnico sabe que debe ir |
| **En Proceso** | Amarillo | Técnico está trabajando |
| **Completada** | Verde claro | Trabajo terminado |
| **Cerrada** | Verde oscuro | Orden finalizada |
| **Cancelada** | Rojo/Gris | Orden cancelada |

### 6.3 Crear una Orden

```
PASO 1: Seleccionar Cliente
────────────────────────────
• Buscar en lista
• Escribir nombre
• Seleccionar de sugerencias

PASO 2: Información del Servicio
────────────────────────────────
• Título: [Instalación internet corporativo    ]
• Descripción: [Instalación de red ethernet...]
• Tipo de servicio: [Instalación ▼]

PASO 3: Programación
────────────────────
• Fecha: [25/03/2026    ]
• Hora:  [09:00        ]
• Prioridad: [Alta ▼]

PASO 4: Notas (Opcional)
────────────────────────
• Notas: [Cliente VIP, solicitar acceso...]

PASO 5: Confirmar
─────────────────
[Crear Orden]  [Cancelar]

Resultado: Orden OS-2026-0342 creada en estado PENDIENTE
```

### 6.4 Actualizar una Orden

Dependiendo del estado, se pueden hacer diferentes acciones:

| Desde Estado | Acciones Disponibles |
|--------------|---------------------|
| Pendiente | Asignar, Editar, Cancelar |
| Asignada | Reasignar, Iniciar, Cancelar |
| En Proceso | Completar, Agregar Evidencia |
| Completada | Cerrar, Reabrir (si hay problemas) |
| Cerrada | ninguna (solo consulta) |

---

## 7. Asignación de Técnicos

### 7.1 Concepto de Técnico

Un **Técnico** es el usuario que ejecuta los servicios en campo. FieldCore gestiona:

| Dato | Descripción |
|------|-------------|
| **Nombre** | Nombre completo |
| **Email** | Correo para notificaciones |
| **Teléfono** | Contacto directo |
| **Especialidades** | Tipos de servicio que puede realizar |
| **Disponibilidad** | Si está activo para asignaciones |
| **Ubicación** | (Futuro) Coordenadas GPS actuales |

### 7.2 Proceso de Asignación

```
┌─────────────────────────────────────────────────────────────────┐
│              ASIGNACIÓN DE TÉCNICO                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Orden: OS-2026-0342 - Instalación internet                     │
│  Cliente: Telecom MX                                             │
│  Fecha: 25/Mar/2026 9:00 AM                                     │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  TÉCNICOS DISPONIBLES:                                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ○ Roberto Sánchez                                       │   │
│  │   Especialidades: Redes, Cableado, Instalación          │   │
│  │   Órdenes hoy: 2 de 5 máximo                           │   │
│  │   Ubicación: Cerca de Polanco ✓                        │   │
│  │   Calificación: ⭐⭐⭐⭐⭐ (5.0)                          │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ○ Juan Pérez                                            │   │
│  │   Especialidades: Reparación, Mantenimiento             │   │
│  │   Órdenes hoy: 3 de 5 máximo                           │   │
│  │   Ubicación: Santa Fe (lejos)                          │   │
│  │   Calificación: ⭐⭐⭐⭐ (4.2)                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ ○ María López                                           │   │
│  │   Especialidades: Redes, Telecomunicaciones              │   │
│  │   Órdenes hoy: 5 de 5 (máximo) ⚠️                      │   │
│  │   Ubicación: Polanco ✓                                  │   │
│  │   Calificación: ⭐⭐⭐⭐ (4.5)                            │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Recomendación: Roberto Sánchez                                  │
│  (Mejor ubicación, menos órdenes, alta calificación)             │
│                                                                 │
│  [ Asignar a Roberto Sánchez ]                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Criterios de Asignación (Lógica Futura)

FieldCore puede considerar múltiples factores para sugerir el mejor técnico:

```
FACTORES DE ASIGNACIÓN:
━━━━━━━━━━━━━━━━━━━━━━━

1. DISPONIBILIDAD
   ¿El técnico está activo?
   ¿No ha llegado a su límite de órdenes diarias?

2. ESPECIALIDAD
   ¿El técnico sabe hacer este tipo de servicio?

3. UBICACIÓN
   ¿Está cerca del cliente?
   ¿Optimiza la ruta del día?

4. CARGA DE TRABAJO
   ¿Cuántas órdenes tiene asignadas?
   ¿Está equilibrado el trabajo?

5. CALIFICACIÓN
   ¿El técnico tiene buenas reseñas?
   ¿Historial positivo con este cliente?

6. HISTORIAL
   ¿Ya ha atendido a este cliente antes?
   ¿Conocimiento previo del lokasi?

RECOMENDACIÓN: El sistema sugiere el mejor candidato
                pero el supervisor decide final
```

---

## 8. Captura de Evidencia

### 8.1 ¿Por qué es Importante la Evidencia?

La evidencia documental es el respaldo de que el servicio **sí se realizó**, **cómo se realizó** y **que el cliente lo aceptó**.

```
EVIDENCIA = PROTECCIÓN LEGAL + CALIDAD + CONFIANZA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Sin Evidencia:
─────────────────────────────────────────────────
❌ "El técnico dice que llegó, pero el cliente dice que no"
❌ "Dice que cambió el filtro, pero no hay pruebas"
❌ "Me cobraron por algo que no se hizo"
❌ Factura sin soporte

Con Evidencia FieldCore:
─────────────────────────────────────────────────
✅ Foto geolocalizada del trabajo completado
✅ Firma del cliente confirmando aceptación
✅ Hora exacta de inicio y fin
✅ Notas del técnico sobre el servicio
✅ Historial trazable de cada intervención
```

### 8.2 Tipos de Evidencia

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| **Fotografía** | Imágenes del trabajo | Antes/después, equipos, entorno |
| **Firma** | Aceptación del cliente | Captura digital en pantalla |
| **Documento** | Comprobantes adicionales | Factura, garantía, manual |

### 8.3 Captura de Fotografías

```
┌─────────────────────────────────────────────────────────────────┐
│              CAPTURA DE EVIDENCIA FOTOGRÁFICA                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Orden: OS-2026-0342                                            │
│  Paso: 3 de 5 - Documentar trabajo                              │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │                    📷                                   │   │
│  │                                                         │   │
│  │              TOMAR FOTO                                 │   │
│  │                                                         │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  CONSEJO: Capture en este orden:                                │
│  1. Equipo/área antes del trabajo                               │
│  2. Durante la intervención                                     │
│  3. Resultado final                                             │
│  4. Detalles importantes (números serie, partes)                 │
│                                                                 │
│  Se capturará:                                                  │
│  • Ubicación GPS                                                │
│  • Fecha y hora exacta                                          │
│  • ID del técnico                                                │
│                                                                 │
│  [ Tomar Foto ]                    [ Saltar (No aplicar) ]     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.4 Captura de Firma Digital

```
┌─────────────────────────────────────────────────────────────────┐
│              FIRMA DIGITAL DEL CLIENTE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Cliente: Telecom MX                                            │
│  Servicio: Instalación internet corporativo                     │
│  Técnico: Roberto Sánchez                                        │
│  Fecha: 25 de Marzo, 2026 - 11:45 AM                           │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  El cliente confirma que:                                       │
│  ✓ El servicio fue realizado satisfactoriamente                 │
│  ✓ Los equipos/imstallaciones funcionan correctamente           │
│  ✓ Acepta el trabajo realizado                                  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │   Firma aquí:                                          │   │
│  │                                                         │   │
│  │                                                         │   │
│  │   ════════════════════════════                         │   │
│  │                                                         │   │
│  │                                                         │   │
│  │   [  Limpiar  ]                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Nombre: Carlos Mendoza                                          │
│                                                                 │
│  [ Confirmar y Guardar Firma ]                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 8.5 Metadata Automática

Cada evidencia capturada incluye:

```
METADATA DE EVIDENCIA:
━━━━━━━━━━━━━━━━━━━━━━━

📸 Fotografía #1
   Archivo: img_20260325_114532.jpg
   Tamaño: 2.4 MB
   Resolución: 4032x3024
   
📍 Ubicación:
   Latitud: 19.432608
   Longitud: -99.133204
   Precisión: ± 5 metros
   
⏰ Tiempo:
   Fecha: 25/03/2026
   Hora: 11:45:32
   Zona horaria: América/Mexico_City
   
👤 Usuario:
   Técnico: Roberto Sánchez
   ID Técnico: TECH-001
   
📋 Orden:
   Orden: OS-2026-0342
   Cliente: Telecom MX

NOTA: Esta metadata es inmutable una vez capturada
```

---

## 9. Seguimiento y Trazabilidad

### 9.1 ¿Qué es la Trazabilidad?

La **trazabilidad** significa que cada orden tiene un historial completo de todo lo que le pasó, quién lo hizo, y cuándo.

### 9.2 Historial de la Orden

```
┌─────────────────────────────────────────────────────────────────┐
│          HISTORIAL: ORDEN OS-2026-0342                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Cliente: Telecom MX, S.A. de C.V.                              │
│  Servicio: Instalación internet corporativo                     │
│  Estado Actual: COMPLETADA                                      │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  📋 TIMELINE DE EVENTOS                                         │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ● 11:45 - Servicio Completado                                 │
│    ├─ Por: Roberto Sánchez                                      │
│    └─ Nota: Instalación exitosa, 4 puntos de red funcionando   │
│                                                                 │
│  ● 11:32 - Evidencia Capturada                                 │
│    ├─ 4 fotografías                                            │
│    ├─ 1 firma digital                                          │
│    └─ Por: Roberto Sánchez                                      │
│                                                                 │
│  ● 09:05 - Servicio Iniciado                                   │
│    ├─ Ubicación verificada: Av. Insurgentes 1000               │
│    └─ Por: Roberto Sánchez                                      │
│                                                                 │
│  ● 08:30 - Orden Asignada                                      │
│    ├─ Técnico: Roberto Sánchez                                  │
│    └─ Por: Supervisor García                                    │
│                                                                 │
│  ● 08:25 - Orden Creada                                        │
│    ├─ Prioridad: Alta                                           │
│    ├─ Fecha Programada: 25/Mar/2026 09:00                       │
│    └─ Por: Supervisor García                                    │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  📊 MÉTRICAS                                                    │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Tiempo de servicio:      40 minutos                            │
│  Tiempo SLA:               60 minutos (meta)                    │
│  Cumplimiento SLA:         ✓ Cumplido (66% del tiempo)          │
│  Tiempo total (creación→cierre): 3 horas 20 minutos             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.3 Notificaciones (Configurables)

FieldCore puede enviar notificaciones en momentos clave:

| Momento | Notificación | Destinatario |
|---------|--------------|--------------|
| Orden creada | "Nueva orden pendiente de asignación" | Supervisor |
| Orden asignada | "Tienes una nueva orden asignada" | Técnico |
| Servicio iniciado | "Técnico llegó al lokasi" | Supervisor |
| Servicio completado | "Orden completada, pendiente cierre" | Supervisor |
| SLA en riesgo | "Orden próxima a vencer SLA" | Supervisor |
| Orden cerrada | "Orden lista para facturación" | Supervisor, (Futuro) Facturación |

### 9.4 Control de SLAs

El **SLA (Service Level Agreement)** define el tiempo承诺 de atención.

```
EJEMPLO DE SLA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tipo de Servicio: Instalación internet corporativo
Tiempo meta: 60 minutos

Gráfico de cumplimiento:

0 min ─────────────────────────────────────── 60 min

████████████████████████████░░░░░░░░░░░░░░░░░░░░░░░
↑                          ↑
Inicio                  Meta SLA

En este ejemplo:
• Tiempo real: 40 minutos
• SLA Cumplido: ✓ (66% del tiempo meta)
• Resultado: Positivo para la empresa
```

---

## 10. Dashboard y Reportes

### 10.1 Dashboard Principal

El **Dashboard** muestra en tiempo real el estado de las operaciones:

```
╔═══════════════════════════════════════════════════════════════════╗
║                     FIELDCORE DASHBOARD                          ║
║                     25 de Marzo, 2026                            ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  📊 VISIÓN GENERAL                                               ║
║  ═══════════════════════════════════════════════════════════════ ║
║                                                                   ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          ║
║  │ ÓRDENES      │  │ COMPLETADAS  │  │ SLAs         │          ║
║  │ HOY          │  │ HOY          │  │ CUMPLIDOS    │          ║
║  │              │  │              │  │              │          ║
║  │    47        │  │    24        │  │    94%       │          ║
║  │  ↑ 12%       │  │  ↑ 8%        │  │  ↑ 3%        │          ║
║  └──────────────┘  └──────────────┘  └──────────────┘          ║
║                                                                   ║
║  📈 ÓRDENES POR ESTADO                                          ║
║  ═══════════════════════════════════════════════════════════════ ║
║                                                                   ║
║  En Proceso    ████████████████████  12 (26%)                   ║
║  Pendientes    ██████████████        8 (17%)                   ║
║  Completadas    ██████████████        7 (15%)                   ║
║  Cerradas       ████████████         6 (13%)                   ║
║  Canceladas     ████                  2 ( 4%)                  ║
║                                                                   ║
║  🏆 TOP TÉCNICOS HOY                                           ║
║  ═══════════════════════════════════════════════════════════════ ║
║                                                                   ║
║  1. Roberto Sánchez    5 órdenes   ⭐5.0   38min avg            ║
║  2. Juan Pérez        4 órdenes   ⭐4.8   45min avg            ║
║  3. María López       4 órdenes   ⭐4.5   52min avg            ║
║                                                                   ║
║  ⚠️ ALERTAS                                                     ║
║  ═══════════════════════════════════════════════════════════════ ║
║                                                                   ║
║  ⚠️ 2 órdenes cerca de vencer SLA                               ║
║  ℹ️  3 técnicos sin órdenes asignadas                            ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

### 10.2 Reportes Disponibles

| Reporte | Descripción | Formato |
|---------|-------------|---------|
| **Resumen Diario** | Órdenes del día por estado | PDF, pantalla |
| **Productividad por Técnico** | Órdenes, tiempo, calificaciones | Excel, PDF |
| **Cumplimiento de SLAs** | % de órdenes dentro del SLA | Gráfico, Excel |
| **Tendencia Mensual** | Comparativa mes actual vs anterior | Gráfico |
| **Clientes más Atendidos** | Top 10 clientes por volumen | Excel |
| **Tiempos Promedio** | Por tipo de servicio | Excel |

### 10.3 Exportación de Datos

```
EXPORTAR REPORTE:
━━━━━━━━━━━━━━━━━━

1. Seleccionar tipo de reporte
2. Definir período (fecha inicio - fin)
3. Filtrar por (opcional):
   • Técnico específico
   • Cliente específico
   • Tipo de servicio
4. Seleccionar formato:
   □ Ver en pantalla
   ☑ Descargar PDF
   ☑ Descargar Excel
5. Click en "Generar Reporte"

Tiempo estimado: 5-30 segundos según complejidad
```

---

## 11. Beneficios Operativos

### 11.1 Para la Empresa

| Beneficio | Impacto |
|-----------|---------|
| **Visibilidad total** | El supervisor sabe qué pasa en todo momento |
| **Eficiencia en asignación** | Órdenes bien distribuidas entre técnicos |
| **Reducción de errores** | Información correcta llega al técnico |
| **Evidencia documentada** | Respaldo para disputas o facturación |
| **Decisiones basadas en datos** | Métricas reales, no intuiciones |
| **Escalabilidad** | Más órdenes sin más supervisores |

### 11.2 Para el Supervisor

| Beneficio | Impacto |
|-----------|---------|
| **Tiempo ahorrado** | Asignación en 1 click vs llamadas |
| **Menos estrés** | Sabe dónde están sus técnicos |
| **Reportes instantáneos** | Un clic vs horas de Excel |
| **Identificación de problemas** | Alertas antes de que sea tarde |

### 11.3 Para el Técnico

| Beneficio | Impacto |
|-----------|---------|
| **Info completa** | Llega preparado, no tiene que llamar |
| **Ruta optimizada** | (Futuro) Mejor organización del día |
| **Reconocimiento** | Calificaciones y feedbacks |
| **Menos papeleo** | Todo digital |

### 11.4 Para el Cliente Final

| Beneficio | Impacto |
|-----------|---------|
| **Actualizaciones** | Sabe cuándo llegará el técnico |
| **Transparencia** | Puede ver el estado de su orden |
| **Evidencia** | El servicio tiene respaldo |
| **Calidad** | Mejor servicio por documentación |

### 11.5 ROI Estimado

```
BENEFICIOS CUANTIFICABLES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

MÉTRICA                    ANTES       DESPUÉS      MEJORA
─────────────────────────────────────────────────────────────────
Tiempo de asignación       15 min      1 min        -93%
Llamadas por incidencia    3           0.5          -83%
Reclamaciones de clientes  5%          1%           -80%
Tiempo de reportes         4 horas     5 minutos    -98%
Cumplimiento SLA           70%         94%          +34%

COSTOS EVITADOS:
─────────────────────────────────────────────────────────────────
Viajes de verificación:    $5,000/mes
Reclamaciones legales:     $15,000/mes
Horas extra de supervisión: $8,000/mes

AHORRO ESTIMADO:           $28,000/mes = $336,000/año

INVERSIÓN FIELDCORE:       ~$5,000/mes (plan profesional)

ROI:                       560% anual
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 12. Alcance del MVP

### 12.1 Funcionalidades Incluidas (Fase 1)

| Módulo | Funcionalidades |
|--------|----------------|
| **Autenticación** | Login con email/contraseña, recuperación de contraseña |
| **Gestión de Usuarios** | Crear, editar, desactivar usuarios con roles |
| **Organizaciones** | Configuración multi-tenant (cada empresa aislada) |
| **Clientes** | CRUD completo de clientes con direcciones |
| **Técnicos** | Perfiles de técnicos con información de contacto |
| **Órdenes de Servicio** | Crear, editar, estados completos, historial |
| **Asignación** | Asignar técnicos a órdenes |
| **Evidencia** | Captura de fotos y firmas digitales |
| **Dashboard** | Vista general con KPIs principales |
| **Reportes** | Exportación básica de datos |

### 12.2 Funcionalidades NO Incluidas (Futuro)

| Funcionalidad | Prioridad | Estimado |
|---------------|-----------|----------|
| App móvil nativa | Alta | Q2 2026 |
| Tracking GPS en tiempo real | Alta | Q2 2026 |
| Notificaciones push | Alta | Q2 2026 |
| Modo offline | Media | Q3 2026 |
| Integración con facturación | Media | Q3 2026 |
| Widget de mapa de técnicos | Media | Q3 2026 |
| Encuestas de satisfacción | Baja | Q4 2026 |
| API pública | Baja | Q4 2026 |

### 12.3 Roles del MVP

| Rol | Alcance |
|-----|---------|
| **Administrador** | Puede hacer todo dentro de su organización |
| **Supervisor** | Puede gestionar órdenes y clientes, ver reportes |
| **Técnico** | Puede ver sus órdenes, iniciar/completar servicios, capturar evidencia |

### 12.4 Límites por Plan

| Recurso | Starter | Professional | Enterprise |
|---------|---------|--------------|------------|
| Usuarios | 5 | 25 | Ilimitado |
| Técnicos | 3 | 15 | Ilimitado |
| Órdenes/mes | 100 | 1,000 | Ilimitado |
| Almacenamiento | 1 GB | 10 GB | 100 GB |
| Reportes | Básico | Avanzado | Personalizado |
| Soporte | Email | Email + Chat | Dedicado |

---

## 13. Próximas Evoluciones

### 13.1 Roadmap 2026

```
╔═══════════════════════════════════════════════════════════════════╗
║                    ROADMAP FIELDCORE 2026                        ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  Q1 2026 ✓ MVP                                                   ║
║  ████████████████████                                            ║
║  [████████████] 100%                                             ║
║                                                                   ║
║  Q2 2026 → Productización                                        ║
║  ░░░░░░░░░░░░░░░░░░░░                                           ║
║  • App móvil React Native║
║  • Tracking GPS técnicos                                          ║
║  • Notificaciones push                                            ║
║  • Widget de mapa                                                ║
║                                                                   ║
║  Q3 2026 → Expansión                                             ║
║  ░░░░░░░░░░░░░░░░░░░░                                           ║
║  • Modo offline                                                  ║
║  • Integración facturación (CFDI)                                ║
║  • API para terceros                                             ║
║  • Widgets personalizados                                       ║
║                                                                   ║
║  Q4 2026 → Escala                                               ║
║  ░░░░░░░░░░░░░░░░░░░░                                           ║
║  • Multi-idioma                                                  ║
║  • Múltiples monedas                                             ║
║  • Análisis avanzado (BI)                                        ║
║  • IA para optimización de rutas                                 ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

### 13.2 Evolución Q2: App Móvil

```
APP MÓVIL FIELDCORE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 Disponible para: iOS y Android

Funcionalidades:
• Dashboard del técnico optimizado
• Vista de órdenes del día
• Navegación gps al cliente
• Captura de fotos
• Captura de firma
• Offline mode (sincroniza después)

Capturas de pantalla:
┌─────────────────┐
│  Mis Órdenes   │
│  Hoy · 5 órdenes│
├─────────────────┤
│ ▸ OS-0342 9:00 │
│   Telecom MX    │
│   Instalación   │
│                 │
│ ▸ OS-0343 11:30│
│   Acme Corp     │
│   Reparación    │
│                 │
│ ▸ OS-0344 14:00│
│   Beta SA       │
│   Mantenimiento │
└─────────────────┘
```

### 13.3 Evolución Q3: Integración de Facturación

```
INTEGRACIÓN CFDI:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FieldCore → SAT (México)
    │
    ├── Genera XML con datos del servicio
    ├── Envía a PAC (certificadora)
    ├── Recibe CFDI timbrado
    └── Almacena para contabilidad

Beneficios:
• Factura automática al cerrar orden
• Datos reales (técnico, tiempo, ubicación)
• Evidencia adjunta como soporte
• Trazabilidad fiscal completa
```

### 13.4 Evolución Q4: Inteligencia Artificial

```
FIELDCORE + IA:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPTIMIZACIÓN DE RUTAS (futuro):
• IA calcula ruta óptima por zona
• Agrupa órdenes por ubicación geográfica
• Reduce tiempo de desplazamiento
• Ahorro en combustible

PREDICCIÓN DE DEMANDA:
• Analiza patrones históricos
• Predice picos de servicio
• Sugiere recursos necesarios

CHATBOT DE SOPORTE:
• Respuestas a preguntas frecuentes
• Seguimiento de órdenes por cliente
• Agenda automática (futuro)
```

---

## Anexo: Glosario de Términos

| Término | Significado |
|---------|-------------|
| **SaaS** | Software como Servicio - Se accede por internet, no se instala |
| **Orden de Servicio** | Tarea específica de servicio a realizar |
| **Técnico** | Persona que ejecuta el servicio en campo |
| **Cliente** | Empresa o persona que recibe el servicio |
| **SLA** | Service Level Agreement - Tiempo compromiso de servicio |
| **Trazabilidad** | Capacidad de seguir el historial completo de una orden |
| **Evidencia** | Prueba documental (fotos, firmas) del servicio |
| **Dashboard** | Panel con métricas y visualizaciones |
| **Multi-tenant** | Varias empresas comparten la plataforma, datos aislados |
| **API** | Interface de programación para conectar sistemas |

---

## Contacto y Soporte

**FieldCore Support:**
- Email: soporte@fieldcore.mx
- Horario: Lunes a Viernes, 9:00 - 18:00 (CDMX)
- Chat en app: Disponible en plataforma

**Documentación adicional:**
- Guía de inicio rápido (próximamente)
- Videos tutoriales (próximamente)
- API Documentation (desarrolladores)

---

**Documento preparado por:** FieldCore Product Team  
**Versión:** 1.0.0  
**Última actualización:** Marzo 2026
