import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import type {
  Column,
  CreateColumnRequest,
  UpdateColumnRequest,
  ReorderColumnRequest
} from '../models';

/**
 * Column Service - Gestión de columnas en boards
 * API Endpoints: /api/v1/boards/:boardId/columns
 */
@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/v1/boards';

  /**
   * Crea una nueva columna en un board
   * POST /api/v1/boards/:boardId/columns
   * @param boardId - ID del board
   * @param column - Datos de la columna a crear
   * @returns Observable<Column>
   */
  create(boardId: string, column: CreateColumnRequest): Observable<Column> {
    return this.http.post<Column>(`${this.API_URL}/${boardId}/columns`, column).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una columna existente
   * PUT /api/v1/boards/:boardId/columns/:columnId
   * @param boardId - ID del board
   * @param columnId - ID de la columna
   * @param column - Datos actualizados de la columna
   * @returns Observable<Column>
   */
  update(boardId: string, columnId: string, column: UpdateColumnRequest): Observable<Column> {
    return this.http.put<Column>(`${this.API_URL}/${boardId}/columns/${columnId}`, column).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Reordena una columna (cambia su posición)
   * PATCH /api/v1/boards/:boardId/columns/:columnId/reorder
   * @param boardId - ID del board
   * @param columnId - ID de la columna
   * @param request - Nueva posición
   * @returns Observable<Column>
   */
  reorder(boardId: string, columnId: string, request: ReorderColumnRequest): Observable<Column> {
    return this.http.patch<Column>(`${this.API_URL}/${boardId}/columns/${columnId}/reorder`, request).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina una columna
   * DELETE /api/v1/boards/:boardId/columns/:columnId
   * @param boardId - ID del board
   * @param columnId - ID de la columna a eliminar
   * @returns Observable<void>
   */
  delete(boardId: string, columnId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${boardId}/columns/${columnId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Maneja errores HTTP
   * @private
   */
  private handleError(error: any): Observable<never> {
    console.error('Column Service Error:', error);
    
    const errorMessage = error?.error?.error 
      || error?.error?.detail 
      || error?.message 
      || 'An unexpected error occurred';

    return throwError(() => ({
      status: error?.status || 500,
      message: errorMessage,
      error: error?.error
    }));
  }
}
