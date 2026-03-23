# FieldCore Platform

> **Plataforma SaaS B2B para gestión de operaciones en campo, técnicos, rutas, evidencias y cumplimiento de SLA.**

![Version](https://img.shields.io/badge/version-0.0.1--alpha-blue)
![License](https://img.shields.io/badge/license-UNLICENSED-red)
![Stack](https://img.shields.io/badge/Stack-NestJS%20%7C%20Next.js%20%7C%20PostgreSQL-green)

## 🎯 Descripción

FieldCore es una plataforma SaaS B2B diseñada para empresas en México y Latinoamérica que necesitan gestionar operaciones de servicio técnico en campo. Permite planear servicios, asignar técnicos, capturar evidencias fotográficas, gestionar firmas digitales y monitorear el cumplimiento de SLA.

## 🏗️ Arquitectura

El proyecto utiliza una arquitectura **Monorepo con Turborepo**, separando:

- **Frontend**: Next.js 14 (App Router) + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: NestJS 10 + TypeScript + Prisma + PostgreSQL + Redis + BullMQ
- **Shared Packages**: Tipos, validadores y configuraciones compartidas

### Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, TypeScript, TailwindCSS, React Query, Zustand, shadcn/ui |
| **Backend** | NestJS 10, TypeScript, Prisma, Redis, BullMQ |
| **Database** | PostgreSQL 15 |
| **Cache/Queue** | Redis 7, BullMQ |
| **Storage** | AWS S3 / MinIO |
| **Infrastructure** | Docker, Terraform, GitHub Actions |

## 📁 Estructura del Proyecto

```
fieldcore-platform/
├── apps/
│   ├── web/           # Frontend Next.js
│   └── api/           # Backend NestJS
├── packages/
│   ├── ui/            # Componentes UI compartidos
│   ├── types/         # Tipos TypeScript
│   └── validators/    # Schemas Zod
├── infra/             # Infraestructura (Docker, Terraform)
├── docs/              # Documentación
└── scripts/           # Scripts de utilidad
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose

### Instalación

```bash
# 1. Clonar repositorio
git clone https://github.com/armandpiano/FieldCore-Platform.git
cd FieldCore-Platform

# 2. Instalar dependencias
pnpm install

# 3. Copiar archivos de entorno
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 4. Iniciar infraestructura
docker compose -f infra/docker/docker-compose.yml up -d

# 5. Ejecutar migraciones
pnpm db:migrate

# 6. Iniciar desarrollo
pnpm dev
```

## 📚 Documentación

- [Arquitectura](./docs/architecture/README.md)
- [Modelo de Datos](./docs/database/README.md)
- [API REST](./docs/api/README.md)
- [Guía de Contribución](./CONTRIBUTING.md)

## 🔐 Modelo de Seguridad

- JWT con refresh tokens
- Autenticación multi-tenant
- Control de acceso basado en roles (RBAC)
- Auditoría completa de operaciones

## 📊 Funcionalidades MVP

- [x] Autenticación (login + roles)
- [x] Multi-empresa (multi-tenant)
- [x] Gestión de clientes
- [x] Órdenes de servicio
- [x] Asignación de técnicos
- [x] Estados de orden
- [x] Evidencia fotográfica
- [x] Firma digital simple
- [x] Comentarios
- [x] Dashboard básico
- [ ] Reportes avanzados

## 🗺️ Roadmap

### Fase 1 — MVP ✅
- [x] Arquitectura técnica
- [x] Modelo de datos
- [x] Prisma schema
- [x] Backend básico
- [ ] Frontend completo
- [ ] Dashboard

### Fase 2 — Productización
- [ ] Tests completos
- [ ] CI/CD
- [ ] Monitoreo (Sentry, DataDog)
- [ ] Documentación API completa

### Fase 3 — Escalamiento
- [ ] Microservicios
- [ ] Multi-region
- [ ] Aplicación móvil
- [ ] Integraciones (WhatsApp, SMS, Email)

## 👥 Autores

**Armando Vazquez** - [GitHub](https://github.com/armandpiano)

## 📝 Licencia

Propiedad de Armando Vazquez. Todos los derechos reservados.

---

Construido con 💪 para el mercado mexicano y latinoamericano.
