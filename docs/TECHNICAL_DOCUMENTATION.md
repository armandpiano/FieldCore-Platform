# FieldCore - Documentación Técnica

**Versión:** 1.0.0  
**Última Actualización:** 25 de Marzo 2026  
**Estado:** MVP Completo  

---

## Tabla de Contenidos

1. [Visión General del Producto](#1-visión-general-del-producto)
2. [Arquitectura General](#2-arquitectura-general)
3. [Arquitectura Backend](#3-arquitectura-backend)
4. [Arquitectura Frontend](#4-arquitectura-frontend)
5. [Modelo de Datos](#5-modelo-de-datos)
6. [Módulos Implementados](#6-módulos-implementados)
7. [Flujos End-to-End](#7-flujos-end-to-end)
8. [Estrategia Multi-Tenant](#8-estrategia-multi-tenant)
9. [Seguridad](#9-seguridad)
10. [Despliegue](#10-despliegue)
11. [Estructura del Repositorio](#11-estructura-del-repositorio)
12. [Convenciones del Proyecto](#12-convenciones-del-proyecto)
13. [Guía de Arranque Local](#13-guía-de-arranque-local)
14. [Roadmap Técnico](#14-roadmap-técnico)

---

## 1. Visión General del Producto

### 1.1 Descripción

**FieldCore** es una plataforma SaaS B2B diseñada para la gestión de operaciones en campo en México y Latinoamérica. El sistema permite a empresas de servicios:

- **Planear** servicios y rutas de atención
- **Asignar** técnicos capacitados a órdenes de trabajo
- **Ejecutar** servicios con seguimiento en tiempo real
- **Capturar** evidencias fotográficas, firmas y ubicaciones GPS
- **Monitorear** el estado de operaciones y cumplimiento de SLA
- **Facturar** con trazabilidad completa

### 1.2 Problema que Resuelve

Las empresas de servicios en campo enfrentan desafíos críticos:

| Problema | Solución FieldCore |
|----------|-------------------|
| Desconocimiento del estado de técnicos | Tracking GPS en tiempo real |
| Evidencias de servicio incompletas | Captura obligatoria de fotos y firma |
| Incumplimiento de SLAs | Alertas y métricas de cumplimiento |
| Facturación sin respaldo | Trazabilidad completa del servicio |
| Multi-organización | Arquitectura multi-tenant robusta |

### 1.3 Stakeholders

```
┌─────────────────────────────────────────────────────────────────┐
│                         STAKEHOLDERS                            │
├─────────────────┬───────────────────────────────────────────────┤
│ Rol             │ Responsabilidad                               │
├─────────────────┼───────────────────────────────────────────────┤
│ Admin           │ Gestión de organización, usuarios y configs    │
│ Supervisor      │ Asignación de técnicos, monitoreo de equipos  │
│ Técnico         │ Ejecución de órdenes, captura de evidencias  │
│ Cliente Final   │ Recepción del servicio, firma de aceptación   │
└─────────────────┴───────────────────────────────────────────────┘
```

### 1.4 Tech Stack

| Capa | Tecnología | Justificación |
|------|------------|---------------|
| **Backend** | NestJS + TypeScript | Robustez, modularidad, TypeScript nativo |
| **Frontend** | Next.js 14 + TypeScript | App Router, SSR, performance |
| **Base de Datos** | PostgreSQL | ACID, JSON, PostGIS (futuro) |
| **ORM** | Prisma | Type-safety, migrations, DX |
| **Cache/Sessions** | Redis | Sessions, cache, queues |
| **Colas** | BullMQ | Jobs async, scheduling |
| **Storage** | S3/MinIO | Evidencias, archivos |
| **Contenedores** | Docker + Docker Compose | Desarrollo consistente |

---

## 2. Arquitectura General

### 2.1 Clean Architecture + Hexagonal

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FIELD CORE ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────┤
││
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                        INTERFACE LAYER                          │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │   │
│   │  │ REST API    │  │ Web (Next)  │  │ Mobile (Future)          │ │   │
│   │  │ Controllers │  │ Pages       │  │ React Native             │ │   │
│   │  └─────────────┘  └─────────────┘  └─────────────────────────┘ │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                      APPLICATION LAYER                          │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │   │
│   │  │ Services    │  │ Use Cases   │  │ DTOs                    │ │   │
│   │  │ (Business)  │  │ (Commands)  │  │ (Validation)            │ │   │
│   │  └─────────────┘  └─────────────┘  └─────────────────────────┘ │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                        DOMAIN LAYER                             │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │   │
│   │  │ Entities    │  │ Value Objs  │  │ Repository Interfaces   │ │   │
│   │  │ (WorkOrder) │  │ (Address)   │  │ (IWorkOrderRepository)  │ │   │
│   │  └─────────────┘  └─────────────┘  └─────────────────────────┘ │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│                                    ▼                                    │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    INFRASTRUCTURE LAYER                         │   │
│   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │   │
│   │  │ PostgreSQL  │  │ Redis       │  │ S3 Storage              │ │   │
│   │  │ (Prisma)    │  │ (Cache)     │  │ (Files)                 │ │   │
│   │  └─────────────┘  └─────────────┘  └─────────────────────────┘ │   │
│   └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Flujo de Datos

```
┌──────────┐     HTTP/REST      ┌──────────┐     Use Case      ┌──────────┐
│  Client  │ ──────────────────▶│  API     │ ──────────────────▶│ Service  │
│  (Web)   │                    │ Gateway  │                    │ (NestJS) │
└──────────┘                    └──────────┘                    └──────────┘
                                    │                                  │
                                    │                                  ▼
                                    │                           ┌──────────┐
                                    │                           │ Domain   │
                                    │                           │ Entities │
                                    │                           └──────────┘
                                    │                                  │
                                    ▼                                  ▼
                               ┌──────────┐                    ┌──────────┐
                               │  Redis   │◀───────────────────│ Repository│
                               │ (Cache)  │                    │ Interface │
                               └──────────┘                    └──────────┘
                                                                    │
                                                                    ▼
                                                            ┌──────────────┐
                                                            │  PostgreSQL  │
                                                            │  (Prisma)    │
                                                            └──────────────┘
```

### 2.3 Monorepo Structure

```
fieldcore-platform/
├── apps/
│   ├── api/              # NestJS Backend
│   └── web/              # Next.js Frontend
├── packages/
│   └── types/            # Shared TypeScript types
├── infrastructure/
│   └── docker/           # Docker configurations
├── .config/              # Quality tools config
│   ├── eslint/           # ESLint configs
│   ├── jest/             # Jest configs
│   ├── prettier/         # Prettier config
│   └── commitlint/       # Commit conventions
├── docs/                 # Documentation
└── pnpm-workspace.yaml   # Workspace config
```

---

## 3. Arquitectura Backend

### 3.1 Estructura de Módulos

```
apps/api/src/
├── modules/
│   ├── identity/                    # Autenticación y usuarios
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   │   └── User.entity.ts
│   │   │   ├── value-objects/
│   │   │   │   ├── Email.vo.ts
│   │   │   │   └── Password.vo.ts
│   │   │   ├── repositories/
│   │   │   │   └── IUserRepository.ts
│   │   │   └── exceptions/
│   │   │       └── Auth.exceptions.ts
│   │   ├── application/
│   │   │   ├── dto/
│   │   │   │   ├── LoginDto.ts
│   │   │   │   └── RegisterDto.ts
│   │   │   └── services/
│   │   │       └── AuthService.ts
│   │   ├── infrastructure/
│   │   │   └── persistence/
│   │   │       └── UserRepository.ts
│   │   └── interface/
│   │       ├── controllers/
│   │       │   └── AuthController.ts
│   │       ├── guards/
│   │       │   ├── JwtAuthGuard.ts
│   │       │   └── RolesGuard.ts
│   │       └── strategies/
│   │           └── JwtStrategy.ts
│   │
│   ├── organizations/               # Multi-tenancy
│   │
│   ├── clients/                    # Gestión de clientes
│   │
│   ├── technicians/                 # Técnicos de campo
│   │
│   ├── work-orders/                # Órdenes de servicio
│   │
│   ├── evidence/                    # Evidencias (fotos, firmas)
│   │
│   ├── reports/                     # Reporting y métricas
│   │
│   └── health/                      # Health checks
│
├── shared/
│   ├── application/
│   ├── domain/
│   │   └── base/
│   │       ├── BaseEntity.ts
│   │       └── BaseRepository.ts
│   ├── infrastructure/
│   │   ├── cache/
│   │   │   └── RedisService.ts
│   │   └── database/
│   │       └── PrismaService.ts
│   └── interface/
│       ├── decorators/
│       ├── filters/
│       └── interceptors/
│
└── main.ts
```

### 3.2 Módulos Implementados

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| **identity** | JWT auth, login, registro, refresh tokens | ✅ |
| **organizations** | Multi-tenant, planes, settings | ✅ |
| **users** | Perfiles, roles, permisos | ✅ |
| **clients** | CRUD clientes, direcciones | ✅ |
| **technicians** | Técnicos, disponibilidad, ubicación | ✅ |
| **work-orders** | Órdenes, estados, asignación | ✅ |
| **evidence** | Fotos, firmas, uploads S3 | ✅ |
| **reports** | Métricas, dashboard data | ✅ |
| **health** | Health checks | ✅ |

### 3.3 Casos de Uso Principales

#### 3.3.1 Crear Orden de Servicio

```typescript
// Use Case: CreateWorkOrder
class CreateWorkOrderUseCase {
  async execute(dto: CreateWorkOrderDto): Promise<WorkOrder> {
    // 1. Validar DTO
    // 2. Verificar cliente existe y pertenece a org
    // 3. Crear entidad WorkOrder
    // 4. Guardar en repositorio
    // 5. Publicar evento de dominio
    // 6. Retornar orden creada
  }
}
```

#### 3.3.2 Asignar Técnico

```typescript
// Use Case: AssignTechnician
class AssignTechnicianUseCase {
  async execute(workOrderId: string, technicianId: string): Promise<WorkOrder> {
    // 1. Verificar orden existe y está en estado "pending"
    // 2. Verificar técnico existe y pertenece a org
    // 3. Verificar técnico tiene capacidad
    // 4. Actualizar orden con technicianId
    // 5. Cambiar estado a "assigned"
    // 6. Notificar técnico (futuro)
  }
}
```

#### 3.3.3 Iniciar Servicio

```typescript
// Use Case: StartService
class StartServiceUseCase {
  async execute(workOrderId: string): Promise<WorkOrder> {
    // 1. Verificar orden está asignada al técnico
    // 2. Cambiar estado a "in_progress"
    // 3. Registrar timestamp de inicio
    // 4. Iniciar tracking GPS
  }
}
```

#### 3.3.4 Cerrar Orden

```typescript
// Use Case: CloseWorkOrder
class CloseWorkOrderUseCase {
  async execute(dto: CloseWorkOrderDto): Promise<WorkOrder> {
    // 1. Verificar orden está en "in_progress"
    // 2. Validar evidencias requeridas
    // 3. Registrar firma (si existe)
    // 4. Calcular duración real
    // 5. Cambiar estado a "completed"
    // 6. Calcular métricas SLA
    // 7. Preparar para facturación
  }
}
```

### 3.4 Estados de Orden

```
                    ┌───────────────┐
                    │    PENDING    │
                    └───────┬───────┘
                            │ assign()
                            ▼
                    ┌───────────────┐
              ┌────▶│   ASSIGNED    │◀────┐
              │     └───────┬───────┘     │
              │ cancel()   │             │ reassign()
              │             │ start()     │
              │             ▼             │
              │     ┌───────────────┐     │
              │     │ IN_PROGRESS  │─────┘
              │     └───────┬───────┘
              │             │ complete()
              │             ▼
              │     ┌───────────────┐
              └─────│   COMPLETED   │
                    └───────┬───────┘
                            │
                            │ close()
                            ▼
                    ┌───────────────┐
                    │    CLOSED     │
                    └───────────────┘

    ┌───────────────┐
    │   CANCELLED   │ (desde PENDING o ASSIGNED)
    └───────────────┘
```

### 3.5 API Endpoints

#### Authentication

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registro de usuario |
| POST | `/auth/login` | Inicio de sesión |
| POST | `/auth/refresh` | Refrescar token |
| POST | `/auth/logout` | Cerrar sesión |
| GET | `/auth/me` | Usuario actual |

#### Clients

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/clients` | Listar clientes |
| POST | `/clients` | Crear cliente |
| GET | `/clients/:id` | Ver cliente |
| PATCH | `/clients/:id` | Actualizar cliente |
| DELETE | `/clients/:id` | Eliminar cliente |

#### Work Orders

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/work-orders` | Listar órdenes |
| POST | `/work-orders` | Crear orden |
| GET | `/work-orders/:id` | Ver orden |
| PATCH | `/work-orders/:id` | Actualizar orden |
| PATCH | `/work-orders/:id/assign` | Asignar técnico |
| PATCH | `/work-orders/:id/start` | Iniciar servicio |
| PATCH | `/work-orders/:id/complete` | Completar servicio |
| PATCH | `/work-orders/:id/close` | Cerrar orden |
| PATCH | `/work-orders/:id/cancel` | Cancelar orden |

#### Evidence

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/evidence/work-orders/:id` | Listar evidencias de orden |
| POST | `/evidence/upload` | Subir evidencia |
| DELETE | `/evidence/:id` | Eliminar evidencia |

---

## 4. Arquitectura Frontend

### 4.1 Estructura de Carpetas

```
apps/web/src/
├── app/                              # Next.js App Router
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── forgot-password/
│   │       └── page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx               # Dashboard layout con sidebar
│   │   ├── page.tsx                 # Dashboard home
│   │   ├── clients/
│   │   │   ├── page.tsx             # Lista de clientes
│   │   │   ├── new/page.tsx        # Crear cliente
│   │   │   └── [id]/
│   │   │       ├── page.tsx         # Ver cliente
│   │   │       └── edit/page.tsx   # Editar cliente
│   │   ├── work-orders/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/
│   │   ├── technicians/
│   │   ├── reports/
│   │   └── profile/
│   ├── layout.tsx                   # Root layout
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── ui/                          # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       └── ...
│
├── modules/                          # Feature modules
│   ├── auth/
│   │   ├── guards/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── pages/
│   ├── clients/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── work-orders/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── technicians/
│   ├── reports/
│   └── dashboard/
│       ├── components/
│       │   └── widgets/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       └── types/
│
├── lib/
│   ├── api-client.ts                # Axios client
│   ├── hooks/                       # Custom hooks
│   └── utils.ts                     # Utilities
│
├── store/
│   ├── auth.store.ts               # Zustand auth store
│   └── ui.store.ts                 # UI state
│
└── providers/
    ├── AuthProvider.tsx
    ├── QueryProvider.tsx
    └── ToastProvider.tsx
```

### 4.2 Estado Global (Zustand)

```typescript
// stores/auth.store.ts
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
```

### 4.3 Data Fetching (React Query)

```typescript
// hooks/useClients.ts
export function useClients(params?: ClientFilters) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => clientService.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

// hooks/useCreateClient.ts
export function useCreateClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clientService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success('Cliente creado exitosamente');
    },
  });
}
```

### 4.4 Pantallas Principales

| Pantalla | Ruta | Descripción |
|----------|------|-------------|
| Login | `/auth/login` | Autenticación |
| Dashboard | `/dashboard` | Vista general KPIs |
| Clientes | `/dashboard/clients` | CRUD clientes |
| Órdenes | `/dashboard/work-orders` | Lista y gestión de órdenes |
| Detalle Orden | `/dashboard/work-orders/:id` | Info completa, evidencias |
| Técnicos | `/dashboard/technicians` | Gestión de técnicos |
| Reportes | `/dashboard/reports` | Reportes y métricas |
| Perfil | `/dashboard/profile` | Perfil de usuario |

---

## 5. Modelo de Datos

### 5.1 Diagrama ER

```
┌─────────────────────┐       ┌─────────────────────┐
│   organizations     │       │      users          │
├─────────────────────┤       ├─────────────────────┤
│ id (PK)             │◀──┐   │ id (PK)             │
│ name                │   │   │ organizationId (FK) │
│ slug                │   └───│ organizationId (FK) │
│ plan                │       │ email               │
│ settings (JSON)     │       │ passwordHash        │
│ isActive            │       │ firstName           │
│ createdAt           │       │ lastName            │
│ updatedAt           │       │ role                │
└─────────────────────┘       │ isActive            │
         │                    │ lastLoginAt         │
         │                    │ createdAt           │
         │                    │ updatedAt           │
         │                    └─────────────────────┘
         │
         │                    ┌─────────────────────┐
         │                    │      clients       │
         │                    ├─────────────────────┤
         │                    │ id (PK)            │
         └────────────────────│ organizationId (FK) │
                              │ name               │
                              │ email              │
                              │ phone              │
                              │ address            │
                              │ latitude           │
                              │ longitude          │
                              │ isActive           │
                              │ createdAt          │
                              │ updatedAt          │
                              └─────────────────────┘
                                        │
                                        │
                              ┌─────────────────────┐
                              │    work_orders      │
                              ├─────────────────────┤
                              │ id (PK)             │
         ┌────────────────────│ organizationId (FK) │
         │                    │ clientId (FK)      │
         │                    │ assignedTo (FK)     │
         │                    │ title               │
         │                    │ description         │
         │                    │ status              │
         │                    │ priority            │
         │                    │ scheduledDate       │
         │                    │ startedAt           │
         │                    │ completedAt         │
         │                    │ closedAt            │
         │                    │ estimatedDuration   │
         │                    │ actualDuration      │
         │                    │ rating              │
         │                    │ notes               │
         │                    │ createdAt          │
         │                    │ updatedAt          │
         │                    └─────────────────────┘
         │                              │
         │                    ┌─────────────────────┐
         │                    │   work_order_events │
         │                    ├─────────────────────┤
         │                    │ id (PK)             │
         └────────────────────│ workOrderId (FK)   │
                              │ eventType           │
                              │ data (JSON)         │
                              │ userId              │
                              │ createdAt           │
                              └─────────────────────┘
                                        │
                                        │
                              ┌─────────────────────┐
                              │     evidences       │
                              ├─────────────────────┤
                              │ id (PK)             │
                              │ workOrderId (FK)    │
                              │ type                │
                              │ url                 │
                              │ thumbnailUrl        │
                              │ description         │
                              │ latitude            │
                              │ longitude           │
                              │ signatureData       │
                              │ capturedAt          │
                              │ createdAt           │
                              └─────────────────────┘

┌─────────────────────┐
│    technicians      │
├─────────────────────┤
│ id (PK)             │
│ userId (FK)         │
│ organizationId (FK) │
│ employeeNumber      │
│ phone               │
│ specializations     │
│ isAvailable         │
│ currentLatitude     │
│ currentLongitude    │
│ createdAt           │
│ updatedAt           │
└─────────────────────┘
```

### 5.2 Esquema Prisma

```prisma
model Organization {
  id        String   @id @default(uuid())
  name      String
  slug      String   @unique
  plan      Plan     @default(STARTER)
  settings  Json     @default("{}")
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  users       User[]
  clients     Client[]
  workOrders  WorkOrder[]
  technicians Technician[]
  
  @@index([slug])
}

model User {
  id             String    @id @default(uuid())
  organizationId  String
  email          String    @unique
  passwordHash   String
  firstName      String
  lastName       String
  role           Role      @default(TECHNICIAN)
  isActive       Boolean   @default(true)
  lastLoginAt    DateTime?
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
  
  organization   Organization @relation(fields: [organizationId], references: [id])
  technician     Technician?
  workOrderEvents WorkOrderEvent[]
  
  @@index([organizationId])
  @@index([email])
}

model Client {
  id             String   @id @default(uuid())
  organizationId  String
  name           String
  email          String?
  phone          String?
  address        String?
  latitude       Float?
  longitude      Float?
  notes          String?
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  organization   Organization @relation(fields: [organizationId], references: [id])
  workOrders     WorkOrder[]
  
  @@index([organizationId])
  @@index([name])
}

model WorkOrder {
  id               String        @id @default(uuid())
  organizationId    String
  clientId         String
  assignedTo       String?
  title            String
  description      String?
  status           WorkOrderStatus @default(PENDING)
  priority         Priority      @default(MEDIUM)
  scheduledDate    DateTime?
  startedAt        DateTime?
  completedAt      DateTime?
  closedAt         DateTime?
  estimatedDuration Int?          // minutos
  actualDuration   Int?          // minutos
  rating           Int?
  notes            String?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt
  
  organization     Organization  @relation(fields: [organizationId], references: [id])
  client          Client        @relation(fields: [clientId], references: [id])
  assignedTechnician User?      @relation("WorkOrderTechnician", fields: [assignedTo], references: [id])
  events          WorkOrderEvent[]
  evidences       Evidence[]
  
  @@index([organizationId])
  @@index([status])
  @@index([scheduledDate])
}

model Evidence {
  id            String       @id @default(uuid())
  workOrderId   String
  type          EvidenceType
  url           String
  thumbnailUrl  String?
  description   String?
  latitude      Float?
  longitude     Float?
  signatureData String?      // Base64 para firmas
  capturedAt    DateTime?
  createdAt     DateTime     @default(now())
  
  workOrder     WorkOrder    @relation(fields: [workOrderId], references: [id])
  
  @@index([workOrderId])
}

model Technician {
  id               String   @id @default(uuid())
  userId           String   @unique
  organizationId   String
  employeeNumber   String?
  phone            String?
  specializations  String[] @default([])
  isAvailable      Boolean  @default(true)
  currentLatitude  Float?
  currentLongitude Float?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  user         User         @relation(fields: [userId], references: [id])
  organization Organization @relation(fields: [organizationId], references: [id])
  
  @@index([organizationId])
  @@index([userId])
}

// Enums
enum Plan {
  STARTER
  PROFESSIONAL
  ENTERPRISE
}

enum Role {
  ADMIN
  SUPERVISOR
  TECHNICIAN
}

enum WorkOrderStatus {
  PENDING
  ASSIGNED
  IN_PROGRESS
  COMPLETED
  CLOSED
  CANCELLED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
  URGENT
}

enum EvidenceType {
  PHOTO
  SIGNATURE
  DOCUMENT
}
```

### 5.3 Índices y Optimización

```sql
-- Índices para queries frecuentes

-- Búsqueda de órdenes por estado
CREATE INDEX idx_work_orders_status ON work_orders(status);

-- Órdenes por fecha de agendamiento
CREATE INDEX idx_work_orders_scheduled ON work_orders(scheduled_date);

-- Órdenes por técnico
CREATE INDEX idx_work_orders_assigned ON work_orders(assigned_to);

-- Evidencias por orden
CREATE INDEX idx_evidences_work_order ON evidences(work_order_id);

-- Eventos por orden (para auditoría)
CREATE INDEX idx_work_order_events ON work_order_events(work_order_id);

-- Búsqueda de clientes por organización
CREATE INDEX idx_clients_org ON clients(organization_id);
```

---

## 6. Módulos Implementados

### 6.1 Identity Module

**Responsabilidad:** Autenticación y autorización de usuarios.

**Componentes:**
- JWT Auth con access/refresh tokens
- Login/Logout/Refresh
- Password hashing (bcrypt)
- Roles y permisos

**Configuración de Tokens:**

```typescript
// Access Token: 15 minutos
// Refresh Token: 7 días
// Tokens almacenados en cookies httpOnly
```

### 6.2 Organizations Module

**Responsabilidad:** Gestión multi-tenant de organizaciones.

**Características:**
- Creación de organizaciones
- Planes (Starter, Professional, Enterprise)
- Settings configurables por org
- Límites según plan

### 6.3 Clients Module

**Responsabilidad:** Gestión de clientes empresariales.

**Características:**
- CRUD completo
- Direcciones con coordenadas GPS
- Notas y metadata
- Historial de órdenes

### 6.4 Technicians Module

**Responsabilidad:** Gestión de técnicos de campo.

**Características:**
- Perfiles de técnicos
- Especializaciones
- Disponibilidad
- Ubicación actual (futuro tracking GPS)

### 6.5 Work Orders Module

**Responsabilidad:** Ciclo de vida completo de órdenes.

**Características:**
- Estados: PENDING → ASSIGNED → IN_PROGRESS → COMPLETED → CLOSED
- Prioridades: LOW, MEDIUM, HIGH, URGENT
- Asignación de técnicos
- Tracking de tiempos
- Eventos de auditoría

### 6.6 Evidence Module

**Responsabilidad:** Captura y almacenamiento de evidencias.

**Características:**
- Subida de fotos a S3
- Firmas digitales (canvas → base64)
- Metadata GPS
- Thumbnail generation
- Tipos: PHOTO, SIGNATURE, DOCUMENT

### 6.7 Reports Module

**Responsabilidad:** Generación de métricas y reportes.

**Características:**
- KPIs de dashboard
- Órdenes por estado
- Tiempos promedio
- Cumplimiento de SLAs

---

## 7. Flujos End-to-End

### 7.1 Creación y Asignación de Orden

```
┌──────────┐                           ┌──────────┐                    ┌──────────┐
│ Supervisor│                           │   API   │                    │   DB    │
└────┬─────┘                           └────┬─────┘                    └────┬─────┘
     │                                      │                              │
     │ 1. POST /work-orders                │                              │
     │    { clientId, title, priority }    │                              │
     │───────────────────────────────────▶│                              │
     │                                      │                              │
     │                                      │ 2. Validar cliente           │
     │                                      │    existe en org              │
     │                                      │──────────────────────────────▶│
     │                                      │                              │
     │                                      │ 3. INSERT work_order         │
     │                                      │    status: PENDING            │
     │                                      │──────────────────────────────▶│
     │                                      │                              │
     │ 4. Response: 201                     │                              │
     │    { id, status: PENDING }           │                              │
     │◀────────────────────────────────────│                              │
     │                                      │                              │
     │──────────────────────────────────────│                              │
     │ 5. POST /work-orders/:id/assign      │                              │
     │    { technicianId }                 │                              │
     │                                      │                              │
     │                                      │ 6. UPDATE work_order          │
     │                                      │    assignedTo, status         │
     │                                      │──────────────────────────────▶│
     │                                      │                              │
     │ 7. Response: 200                     │                              │
     │◀─────────────────────────────────────│                              │
     │                                      │                              │
```

### 7.2 Técnico Ejecuta Orden

```
┌──────────┐                           ┌──────────┐                    ┌──────────┐
│  App     │                           │   API   │                    │   S3/DB  │
│ (Técnico)│                           └────┬─────┘                    └────┬─────┘
└────┬─────┘                                │                              │
     │                                      │                              │
     │ 1. PATCH /work-orders/:id/start     │                              │
     │────────────────────────────────────▶│                              │
     │                                      │                              │
     │                                      │ 2. UPDATE status             │
     │                                      │    IN_PROGRESS, startedAt    │
     │                                      │──────────────────────────────▶│
     │                                      │                              │
     │ 3. Response: 200                    │                              │
     │◀─────────────────────────────────────│                              │
     │                                      │                              │
     │ 4. POST /evidence/upload (foto)      │                              │
     │    [multipart/form-data]            │                              │
     │────────────────────────────────────▶│                              │
     │                                      │                              │
     │                                      │ 5. Upload to S3              │
     │                                      │──────────────────────────────▶│
     │                                      │                              │
     │                                      │ 6. INSERT evidence           │
     │                                      │──────────────────────────────▶│
     │                                      │                              │
     │ 7. Response: 201                    │                              │
     │◀─────────────────────────────────────│                              │
     │                                      │                              │
```

### 7.3 Cierre de Orden con Firma

```
┌──────────┐                           ┌──────────┐                    ┌──────────┐
│  App     │                           │   API   │                    │   S3     │
└────┬─────┘                           └────┬─────┘                    └────┬─────┘
     │                                      │                              │
     │ 1. POST /evidence/upload            │                              │
     │    type: SIGNATURE                 │                              │
     │    signatureData: base64            │                              │
     │────────────────────────────────────▶│                              │
     │                                      │                              │
     │                                      │ 2. Store signature           │
     │                                      │──────────────────────────────▶│
     │                                      │                              │
     │ 3. Response: 201                     │                              │
     │◀─────────────────────────────────────│                              │
     │                                      │                              │
     │ 4. PATCH /work-orders/:id/complete  │                              │
     │────────────────────────────────────▶│                              │
     │                                      │                              │
     │                                      │ 5. Validar evidencias        │
     │                                      │    requeridas                │
     │                                      │                              │
     │                                      │ 6. UPDATE status            │
     ││    COMPLETED, completedAt    │
     │                                      │──────────────────────────────▶│
     │                                      │                              │
     │ 7. Response: 200                     │                              │
     │◀─────────────────────────────────────│                              │
     │                                      │                              │
     │ 8. PATCH /work-orders/:id/close      │                              │
     │    { rating, notes }                 │                              │
     │────────────────────────────────────▶│                              │
     │                                      │                              │
     │                                      │ 9. UPDATE status            │
     │                                      │    CLOSED, closedAt          │
     │                                      │──────────────────────────────▶│
     │                                      │                              │
     │ 10. Response: 200                    │                              │
     │◀─────────────────────────────────────│                              │
     │                                      │                              │
```

---

## 8. Estrategia Multi-Tenant

### 8.1 Arquitectura

```
┌────────────────────────────────────────────────────────────────┐
│                    FIELD CORE - MULTI-TENANT                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Org A  │  │   Org B  │  │   Org C  │  │   Org D  │      │
│  │ Tenant   │  │ Tenant   │  │ Tenant   │  │ Tenant   │      │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      │
│       │              │              │              │           │
│       └──────────────┴──────────────┴──────────────┘           │
│                            │                                   │
│                            ▼                                   │
│                   ┌─────────────────┐                         │
│                   │   SHARED        │                         │
│                   │   DATABASE      │                         │
│                   │   (PostgreSQL)  │                         │
│                   │                 │                         │
│                   │ organization_id │                         │
│                   │    ISOLATION    │                         │
│                   └─────────────────┘                         │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### 8.2 Aislamiento por Organización

```typescript
// Every query is scoped by organizationId
// Implemented via Prisma middleware

prisma.$use(async (params, next) => {
  if (params.model && !['Organization'].includes(params.model)) {
    // Auto-add organizationId filter
    const user = getCurrentUser();
    if (user && params.action === 'findMany') {
      params.args.where = {
        ...params.args.where,
        organizationId: user.organizationId,
      };
    }
  }
  return next(params);
});
```

### 8.3 Middleware de Tenant

```typescript
// Decorator to enforce tenant isolation
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const user = req.user as User;
    
    if (user && user.organizationId) {
      req.tenantId = user.organizationId;
    }
    
    next();
  }
}
```

### 8.4 Límites por Plan

```typescript
const PLAN_LIMITS = {
  STARTER: {
    users: 5,
    technicians: 3,
    workOrdersPerMonth: 100,
    storage: 1 * 1024 * 1024 * 1024, // 1GB
  },
  PROFESSIONAL: {
    users: 25,
    technicians: 15,
    workOrdersPerMonth: 1000,
    storage: 10 * 1024 * 1024 * 1024, // 10GB
  },
  ENTERPRISE: {
    users: -1, // unlimited
    technicians: -1,
    workOrdersPerMonth: -1,
    storage: 100 * 1024 * 1024 * 1024, // 100GB
  },
};
```

---

## 9. Seguridad

### 9.1 Autenticación JWT

```typescript
// Token Configuration
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// JWT Payload
interface JwtPayload {
  sub: string;        // User ID
  email: string;
  role: Role;
  organizationId: string;
}
```

### 9.2 Estrategias de Seguridad

| Capa | Medida |
|------|--------|
| **Transporte** | HTTPS obligatorio, HSTS |
| **Auth** | JWT + Refresh Tokens, httpOnly cookies |
| **Contraseñas** | bcrypt con salt rounds 12 |
| **API** | Rate limiting, CORS configurado |
| **DB** | Prepared statements (Prisma), parameterized queries |
| **Storage** | Pre-signed URLs para S3, expiran en 1h |
| **Headers** | helmet.js, CSP, X-Frame-Options |

### 9.3 Control de Acceso (RBAC)

```typescript
// Roles hierarchy
enum Role {
  ADMIN = 'ADMIN',        // Full access
  SUPERVISOR = 'SUPERVISOR', // Team management
  TECHNICIAN = 'TECHNICIAN', // Own work orders only
}

// Guards
@Roles(Role.ADMIN, Role.SUPERVISOR)
@Controller('work-orders')
class WorkOrderController {
  // Accessible by Admin and Supervisors
}

@UseGuards(JwtAuthGuard, RolesGuard)
```

### 9.4 Validación de Input

```typescript
// DTO with class-validator
export class CreateWorkOrderDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  title: string;

  @IsNotEmpty()
  @IsUUID()
  clientId: string;

  @IsEnum(Priority)
  priority: Priority;

  @IsOptional()
  @IsDateString()
  scheduledDate?: string;
}
```

---

## 10. Despliegue

### 10.1 Arquitectura de Infraestructura

```
┌─────────────────────────────────────────────────────────────────┐
│                         AWS / Cloud Provider                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    CloudFront CDN                            ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Application Load Balancer                 ││
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   ││
│  │  │  API (Nest) │  │  Web (Next)  │  │  Admin (Future)  │   ││
│  │  │  :3001      │  │  :3000      │  │  :3002          │   ││
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                   │
│            ┌─────────────────┼─────────────────┐               │
│            ▼                 ▼                 ▼               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ PostgreSQL  │  │   Redis     │  │    S3 Bucket           │ │
│  │  (RDS)      │  │ (ElastiCache)│  │  - Evidences          │ │
│  │             │  │             │  │  - Thumbnails         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 Docker Compose (Desarrollo)

```yaml
# infrastructure/docker/docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: fieldcore
      POSTGRES_USER: fieldcore
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  api:
    build:
      context: ../apps/api
      dockerfile: ../infrastructure/docker/Dockerfile.api
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://fieldcore:${DB_PASSWORD}@postgres:5432/fieldcore
      REDIS_HOST: redis
    depends_on:
      - postgres
      - redis

  web:
    build:
      context: ../apps/web
      dockerfile: ../infrastructure/docker/Dockerfile.web
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
    depends_on:
      - api
      - web

volumes:
  postgres_data:
  redis_data:
```

### 10.3 Variables de Entorno

```bash
# API
DATABASE_URL=postgresql://...
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
AWS_S3_BUCKET=fieldcore-evidence
AWS_REGION=us-east-1

# Web
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 11. Estructura del Repositorio

### 11.1 Árbol Completo

```
FieldCore-Platform/
│
├── apps/
│   ├── api/                          # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/              # Feature modules
│   │   │   │   ├── identity/
│   │   │   │   ├── organizations/
│   │   │   │   ├── clients/
│   │   │   │   ├── technicians/
│   │   │   │   ├── work-orders/
│   │   │   │   ├── evidence/
│   │   │   │   ├── reports/
│   │   │   │   └── health/
│   │   │   ├── shared/               # Shared utilities
│   │   │   │   ├── application/
│   │   │   │   ├── domain/
│   │   │   │   ├── infrastructure/
│   │   │   │   └── interface/
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma
│   │   │   │   └── migrations/
│   │   │   └── main.ts
│   │   ├── test/
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   └── web/                          # Next.js Frontend
│       ├── src/
│       │   ├── app/                  # App Router pages
│       │   ├── components/           # UI components
│       │   ├── modules/              # Feature modules
│       │   ├── lib/                 # Utilities
│       │   ├── store/               # Zustand stores
│       │   └── providers/           # React providers
│       ├── public/
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   └── types/                        # Shared TypeScript types
│       ├── src/
│       │   ├── api/
│       │   ├── entities/
│       │   └── index.ts
│       └── package.json
│
├── infrastructure/
│   └── docker/                       # Docker configs
│       ├── docker-compose.yml
│       ├── docker-compose.prod.yml
│       ├── Dockerfile.api
│       ├── Dockerfile.web
│       ├── nginx/
│       └── postgres/
│
├── docs/                             # Documentation
│   └── TECHNICAL_DOCUMENTATION.md
│
├── .config/                          # Quality tools
│   ├── eslint/
│   ├── jest/
│   ├── prettier/
│   ├── commitlint/
│   └── quality/
│
├── .husky/                           # Git hooks
│   ├── pre-commit
│   └── commit-msg
│
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── README.md
```

---

## 12. Convenciones del Proyecto

### 12.1 Conventional Commits

```
<type>(<scope>): <description>

Types:
  feat     - New feature
  fix      - Bug fix
  docs     - Documentation
  style    - Formatting (no code change)
  refactor - Code refactoring
  perf     - Performance improvement
  test     - Adding or correcting tests
  build    - Build system changes
  ci       - CI/CD changes
  chore    - Maintenance tasks
  hotfix   - Critical hotfix
  deps     - Dependency updates

Examples:
  feat(auth): add JWT refresh token support
  fix(clients): resolve pagination issue
  docs(api): update endpoint documentation
```

### 12.2 Estructura de Ramas

```
main (production)
  └── develop (integration)
        ├── feature/TICKET-description
        ├── bugfix/TICKET-description
        ├── hotfix/TICKET-description
        └── release/v1.0.0
```

### 12.3 Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables | camelCase | `isActive`, `workOrderId` |
| Functions | camelCase | `createWorkOrder`, `getClients` |
| Classes | PascalCase | `WorkOrderService`, `ClientController` |
| Interfaces | PascalCase | `IWorkOrderRepository`, `CreateClientDto` |
| Constants | UPPER_SNAKE | `MAX_RETRY_ATTEMPTS`, `API_BASE_URL` |
| Files (TS/TSX) | kebab-case | `work-order.service.ts`, `client-list.tsx` |
| Directories | kebab-case | `work-orders/`, `shared/utils/` |
| Database tables | snake_case | `work_orders`, `work_order_events` |
| Enums | PascalCase | `WorkOrderStatus.PENDING` |
| Environment vars | UPPER_SNAKE | `DATABASE_URL`, `JWT_SECRET` |

### 12.4 TypeScript Guidelines

```typescript
// ✅ Use interfaces for public APIs
interface UserResponse {
  id: string;
  email: string;
  role: Role;
}

// ✅ Use type for unions and computed types
type WorkOrderStatus = 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';

// ✅ Use const for enums
const WorkOrderStatus = {
  PENDING: 'PENDING',
  ASSIGNED: 'ASSIGNED',
} as const;
type WorkOrderStatus = typeof WorkOrderStatus[keyof typeof WorkOrderStatus];

// ✅ Strict null checks
function getUser(id: string): User | null {
  // Return null, not undefined
}

// ✅ Use readonly for immutable data
interface CreateClientDto {
  readonly name: string;
  readonly email?: string;
}
```

---

## 13. Guía de Arranque Local

### 13.1 Requisitos

| Herramienta | Versión Mínima |
|-------------|----------------|
| Node.js | 20.0.0 |
| pnpm | 8.0.0 |
| Docker | 24.0.0 |
| Docker Compose | 2.0.0 |

### 13.2 Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/armandpiano/FieldCore-Platform.git
cd FieldCore-Platform

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp infrastructure/docker/.env.example infrastructure/docker/.env

# 4. Editar .env con tus valores
# DATABASE_URL=postgresql://fieldcore:password@localhost:5432/fieldcore
# JWT_SECRET=your-secret-key
# JWT_REFRESH_SECRET=your-refresh-secret
```

### 13.3 Desarrollo con Docker

```bash
# Iniciar servicios (PostgreSQL, Redis)
cd infrastructure/docker
docker-compose up -d postgres redis

# Regresar al root
cd ../..

# Generar cliente Prisma
pnpm --filter api db:generate

# Ejecutar migraciones
pnpm --filter api db:migrate

# Iniciar API
pnpm dev:api

# En otra terminal, iniciar Web
pnpm dev:web
```

### 13.4 URLs de Desarrollo

| Servicio | URL |
|----------|-----|
| Web App | http://localhost:3000 |
| API | http://localhost:3001 |
| Prisma Studio | http://localhost:5555 |
| Swagger | http://localhost:3001/api/docs |

### 13.5 Scripts Disponibles

```bash
# Development
pnpm dev              # Iniciar todos los apps
pnpm dev:api          # Solo API
pnpm dev:web          # Solo Web

# Building
pnpm build            # Build all
pnpm build:api        # Build API
pnpm build:web        # Build Web

# Testing
pnpm test             # Run all tests
pnpm test:api         # API tests
pnpm test:web         # Web tests

# Quality
pnpm lint             # Lint all
pnpm lint:fix         # Fix lint errors
pnpm format           # Format code
pnpm typecheck        # TypeScript check

# Database
pnpm db:migrate       # Run migrations
pnpm db:seed          # Seed database
pnpm db:studio        # Open Prisma Studio
pnpm db:generate      # Generate Prisma client
```

### 13.6 Credenciales de Prueba

Después de ejecutar `pnpm db:seed`:

```
Email: admin@fieldcore.com
Password: Admin123!

Email: supervisor@fieldcore.com
Password: Supervisor123!

Email: tecnico@fieldcore.com
Password: Tecnico123!
```

---

## 14. Roadmap Técnico

### 14.1 Fase 1 - MVP (Completado)

| Módulo | Estado | Notas |
|--------|--------|-------|
| Auth (JWT) | ✅ | Login, registro, refresh |
| Organizaciones | ✅ | Multi-tenant básico |
| Usuarios | ✅ | CRUD, roles |
| Clientes | ✅ | CRUD completo |
| Técnicos | ✅ | Perfiles básicos |
| Órdenes | ✅ | CRUD, estados |
| Evidencias | ✅ | Fotos, firmas |
| Dashboard | ✅ | KPIs básicos |
| Documentación | ✅ | README, esta doc |

### 14.2 Fase 2 - Productización (Q2 2026)

| Feature | Prioridad | Descripción |
|---------|-----------|-------------|
| Tracking GPS | Alta | Ubicación real técnicos |
| Notificaciones Push | Alta | FCM, APNs |
| Offline Mode | Media | PWA con sync |
| App Mobile | Media | React Native |
| Facturación | Media | Integración con CFDI |
| Reports Avanzados | Media | Exportar PDF/Excel |

### 14.3 Fase 3 - Escalamiento (Q3-Q4 2026)

| Feature | Prioridad | Descripción |
|---------|-----------|-------------|
| Microservicios | Alta | Extraer módulos críticos |
| Búsqueda | Alta | Elasticsearch |
| Cache Avanzado | Media | Redis Cluster |
| CDN Evidencias | Media | CloudFront |
| Multi-región | Baja | Latam data centers |

### 14.4 Métricas de Éxito

| Métrica | Target |
|---------|--------|
| Uptime | 99.9% |
| Response Time (p95) | < 200ms |
| Build Time | < 5 min |
| Test Coverage | > 70% |
| Error Rate | < 0.1% |

---

## Anexo: Glosario

| Término | Definición |
|---------|------------|
| **Tenant** | Organización cliente en el sistema multi-tenant |
| **Work Order** | Orden de servicio asignada a un técnico |
| **Evidence** | Foto, firma o documento attached a una orden |
| **SLA** | Service Level Agreement - Tiempo compromiso de servicio |
| **Multi-tenant** | Arquitectura donde múltiples clientes comparten recursos |
| **Clean Architecture** | Patrón de arquitectura con capas separadas |
| **DTO** | Data Transfer Object - Objeto para transferir datos |
| **VO** | Value Object - Objeto inmutable con identidad basada en valores |

---

**Documento preparado por:** FieldCore Tech Team  
**Última actualización:** 25 de Marzo 2026  
**Versión:** 1.0.0
