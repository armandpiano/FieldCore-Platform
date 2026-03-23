/**
 * RedisModule - Cache Module
 * Provides RedisService globally
 */

import { Module, Global, Provider } from '@nestjs/common';
import { RedisService } from './redis.service';

export const REDIS_SERVICE = 'REDIS_SERVICE';

const redisProvider: Provider = {
  provide: REDIS_SERVICE,
  useClass: RedisService,
};

@Global()
@Module({
  providers: [redisProvider],
  exports: [REDIS_SERVICE],
})
export class RedisModule {}
