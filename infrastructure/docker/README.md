# FieldCore Infrastructure

Docker-based infrastructure for FieldCore SaaS platform.

## Services

| Service | Port | Purpose |
|---------|------|---------|
| web | 3000 | Next.js Frontend |
| api | 3001 | NestJS Backend |
| postgres | 5432 | PostgreSQL Database |
| redis | 6379 | Redis Cache |
| minio | 9000 | S3 Storage |

## Quick Start

```bash
# 1. Navigate to infrastructure
cd infrastructure/docker

# 2. Copy environment
cp .env.example .env

# 3. Start services
docker-compose up -d

# 4. Verify
curl http://localhost:3001/health
curl http://localhost:3000
```

## Commands

```bash
# Start all
docker-compose up -d

# Rebuild
docker-compose up -d --build

# Stop
docker-compose down

# Stop with volumes
docker-compose down -v

# Logs
docker-compose logs -f api
docker-compose logs -f web
```

## Access

- Web: http://localhost:3000
- API: http://localhost:3001
- API Docs: http://localhost:3001/api/docs
- MinIO Console: http://localhost:9001 (minioadmin/minioadmin_secret)

## Database Access

```bash
docker exec -it fieldcore-postgres psql -U fieldcore -d fieldcore
```

## Redis Access

```bash
docker exec -it fieldcore-redis redis-cli
```
