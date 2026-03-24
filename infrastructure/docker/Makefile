# ============================================
# FieldCore Makefile
# Convenience commands for Docker operations
# ============================================

.PHONY: help up down build logs ps clean db migrate restart

# Default target
help:
	@echo "FieldCore Docker Commands"
	@echo "========================"
	@echo "make up         - Start all services"
	@echo "make down       - Stop all services"
	@echo "make build      - Build and start services"
	@echo "make logs       - View all logs"
	@echo "make logs-api   - View API logs"
	@echo "make logs-web   - View Web logs"
	@echo "make ps         - Show service status"
	@echo "make db         - Open PostgreSQL CLI"
	@echo "make redis      - Open Redis CLI"
	@echo "make migrate    - Run database migrations"
	@echo "make clean      - Stop and remove volumes"
	@echo "make restart    - Restart all services"

# Start all services
up:
	docker-compose up -d
	@echo "Services started. Access:"
	@echo "  Web: http://localhost:3000"
	@echo "  API: http://localhost:3001"
	@echo "  MinIO: http://localhost:9001"

# Stop all services
down:
	docker-compose down

# Build and start
build:
	docker-compose up -d --build

# View logs
logs:
	docker-compose logs -f

# View API logs
logs-api:
	docker-compose logs -f api

# View Web logs
logs-web:
	docker-compose logs -f web

# Show service status
ps:
	docker-compose ps

# Open PostgreSQL CLI
db:
	docker exec -it fieldcore-postgres psql -U fieldcore -d fieldcore

# Open Redis CLI
redis:
	docker exec -it fieldcore-redis redis-cli

# Run migrations
migrate:
	docker exec -it fieldcore-api npx prisma migrate deploy

# Generate Prisma client
generate:
	docker exec -it fieldcore-api npx prisma generate

# Restart all services
restart:
	docker-compose restart

# Clean up everything
clean:
	docker-compose down -v
	@echo "All volumes removed"

# Rebuild without cache
rebuild:
	docker-compose down
	docker system prune -a -f
	docker-compose up -d --build

# Enter API container
shell-api:
	docker exec -it fieldcore-api sh

# Enter Web container
shell-web:
	docker exec -it fieldcore-web sh

# Health check
health:
	@echo "Checking services..."
	@curl -s http://localhost:3001/health && echo " API: OK" || echo " API: FAIL"
	@curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 && echo " Web: OK" || echo " Web: FAIL"
