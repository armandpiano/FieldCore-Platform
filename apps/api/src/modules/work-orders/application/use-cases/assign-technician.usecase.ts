/**
 * AssignTechnicianUseCase - Application Use Case
 */

import { Injectable } from '@nestjs/common';

export interface AssignTechnicianInput {
  workOrderId: string;
  technicianId: string;
  organizationId: string;
  assignedById: string;
  notes?: string;
}

@Injectable()
export class AssignTechnicianUseCase {
  async execute(input: AssignTechnicianInput): Promise<any> {
    // In real implementation, update work order in database
    return {
      id: input.workOrderId,
      technicianId: input.technicianId,
      status: 'ASSIGNED',
      assignedAt: new Date(),
      assignedById: input.assignedById,
    };
  }
}
