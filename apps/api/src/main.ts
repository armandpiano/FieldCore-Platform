/**
 * FieldCore API - Bootstrap
 * NestJS Application Entry Point
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './shared/interface/filters/http-exception.filter';
import { LoggingInterceptor } from './shared/interface/interceptors/logging.interceptor';
import { TransformInterceptor } from './shared/interface/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get('PORT', '3001');
  const host = configService.get('HOST', '0.0.0.0');
  const environment = configService.get('NODE_ENV', 'development');

  // Enable CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'api/v',
  });

  // Global Prefix
  app.setGlobalPrefix('api', {
    exclude: ['health'],
  });

  // Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Interceptors
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TransformInterceptor(),
  );

  // Swagger Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('FieldCore API')
    .setDescription('API para gestión de operaciones en campo')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticación')
    .addTag('work-orders', 'Órdenes de trabajo')
    .addTag('clients', 'Clientes')
    .addTag('technicians', 'Técnicos')
    .addTag('evidence', 'Evidencias')
    .addTag('reports', 'Reportes')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  // Start Server
  await app.listen(port, host);
  
  console.log(`
  ╔══════════════════════════════════════════════════════════════╗
  ║                                                              ║
  ║   🏗️  FieldCore API - ${environment.toUpperCase().padEnd(40)}║
  ║                                                              ║
  ║   🌐  http://${host}:${port}/api                              ║
  ║   📖  http://${host}:${port}/docs                             ║
  ║   ❤️  http://${host}:${port}/health                           ║
  ║                                                              ║
  ╚══════════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
