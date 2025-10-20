/**
 * Modelos Comunes - Planify
 * Errores, respuestas genéricas y utilidades
 */

export interface ApiError {
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  correlationId?: string;
  error?: string;
  errors?: Record<string, string[]>;
  type?: string;
  traceId?: string;
}

export interface HealthStatus {
  status: 'Healthy' | 'Unhealthy';
  error?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}
