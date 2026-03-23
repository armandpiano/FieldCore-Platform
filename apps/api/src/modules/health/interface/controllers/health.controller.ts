/**
 * HealthController - Health Check Endpoint
 */

import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'fieldcore-api',
      version: '0.0.1',
    };
  }
}
