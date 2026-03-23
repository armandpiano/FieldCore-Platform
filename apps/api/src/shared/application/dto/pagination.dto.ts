/**
 * Pagination DTOs
 * Standard pagination response for all list endpoints
 */

export class PaginationParams {
  page: number = 1;
  limit: number = 20;
  sortBy?: string;
  sortOrder: 'asc' | 'desc' = 'asc';
}

export class PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  constructor(data: T[], total: number, page: number, limit: number) {
    this.data = data;
    this.total = total;
    this.page = page;
    this.limit = limit;
    this.totalPages = Math.ceil(total / limit);
    this.hasNextPage = page < this.totalPages;
    this.hasPreviousPage = page > 1;
  }
}

export class ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  requestId?: string;

  constructor(data: T) {
    this.success = true;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}
