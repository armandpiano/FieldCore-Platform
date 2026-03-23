/**
 * GetWorkOrderDetailUseCase - Application Use Case
 */

import { Injectable, NotFoundException } from '@nestjs/common';

export interface GetWorkOrderDetailInput {
  id: string;
  organizationId: string;
}

@Injectable()
export class GetWorkOrderDetailUseCase {
  async execute(input: GetWorkOrderDetailInput): Promise<any> {
    // In real implementation, query from database
    return {
      id: input.id,
      folio: 'OS-2026-0001',
      title: 'Instalación de equipo',
      status: 'PENDING',
      priority: 'MEDIUM',
      clientId: 'client-uuid',
      scheduledDate: new Date(),
      slaDeadline: new Date(),
      createdAt: new Date(),
    };
  }
}
