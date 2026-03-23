/**
 * ListWorkOrdersUseCase - Application Use Case
 */

import { Injectable } from '@nestjs/common';

export interface ListWorkOrdersInput {
  organizationId: string;
  pagination: { page: number; limit: number };
  filters?: {
    status?: string[];
    priority?: string[];
    technicianId?: string;
    search?: string;
  };
}

export interface ListWorkOrdersOutput {
  data: any[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ListWorkOrdersUseCase {
  async execute(input: ListWorkOrdersInput): Promise<ListWorkOrdersOutput> {
    // In real implementation, query from database
    return {
      data: [],
      total: 0,
      page: input.pagination.page,
      limit: input.pagination.limit,
      totalPages: 0,
    };
  }
}
