/**
 * StartServiceUseCase - Application Use Case
 */

import { Injectable } from '@nestjs/common';

export interface StartServiceInput {
  workOrderId: string;
  organizationId: string;
}

@Injectable()
export class StartServiceUseCase {
  async execute(input: StartServiceInput): Promise<any> {
    // In real implementation, update work order status to IN_PROGRESS
    return {
      id: input.workOrderId,
      status: 'IN_PROGRESS',
      startedAt: new Date(),
    };
  }
}
