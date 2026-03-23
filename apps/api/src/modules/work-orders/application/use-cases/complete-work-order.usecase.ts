/**
 * CompleteWorkOrderUseCase - Application Use Case
 */

import { Injectable } from '@nestjs/common';

export interface CompleteWorkOrderInput {
  workOrderId: string;
  organizationId: string;
  closureNotes?: string;
  actualDuration?: number;
}

@Injectable()
export class CompleteWorkOrderUseCase {
  async execute(input: CompleteWorkOrderInput): Promise<any> {
    // In real implementation, update work order status to COMPLETED
    return {
      id: input.workOrderId,
      status: 'COMPLETED',
      completedAt: new Date(),
      closureNotes: input.closureNotes,
      actualDuration: input.actualDuration,
    };
  }
}
