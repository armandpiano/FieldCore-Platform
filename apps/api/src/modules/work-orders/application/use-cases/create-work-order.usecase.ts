/**
 * CreateWorkOrderUseCase - Application Use Case
 */

import { Injectable } from '@nestjs/common';

export interface CreateWorkOrderInput {
  organizationId: string;
  title: string;
  description?: string;
  clientId: string;
  clientSiteId?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  scheduledDate: string;
  estimatedDuration?: number;
  notes?: string;
  createdById: string;
}

export interface CreateWorkOrderOutput {
  id: string;
  folio: string;
  title: string;
  status: string;
  priority: string;
  clientId: string;
  scheduledDate: Date;
  slaDeadline: Date;
  createdAt: Date;
}

@Injectable()
export class CreateWorkOrderUseCase {
  async execute(input: CreateWorkOrderInput): Promise<CreateWorkOrderOutput> {
    // Generate folio (in real implementation, get from repository)
    const folio = `OS-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`;
    
    // Calculate SLA deadline (24 hours from scheduled date)
    const scheduledDate = new Date(input.scheduledDate);
    const slaDeadline = new Date(scheduledDate.getTime() + 24 * 60 * 60 * 1000);

    // In real implementation, save to database via repository
    const result: CreateWorkOrderOutput = {
      id: crypto.randomUUID(),
      folio,
      title: input.title,
      status: 'PENDING',
      priority: input.priority,
      clientId: input.clientId,
      scheduledDate,
      slaDeadline,
      createdAt: new Date(),
    };

    return result;
  }
}
