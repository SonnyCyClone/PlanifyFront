import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import type {
  Board,
  BoardWithDetails,
  CreateBoardRequest,
  UpdateBoardRequest
} from '../models';

/**
 * Board Service - Gestión de tableros
 * API Endpoints: /api/v1/boards
 */
@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/v1/boards';

  /**
   * Obtiene todos los boards del usuario
   * GET /api/v1/boards
   * @returns Observable<Board[]>
   */
  getAll(): Observable<Board[]> {
    return this.http.get<Board[]>(this.API_URL).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene un board por ID con sus columnas y tareas
   * GET /api/v1/boards/:id
   * @param id - ID del board
   * @returns Observable<BoardWithDetails>
   */
  getById(id: string): Observable<BoardWithDetails> {
    return this.http.get<BoardWithDetails>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea un nuevo board
   * POST /api/v1/boards
   * Nota: Se crean automáticamente 3 columnas (To Do, In Progress, Done)
   * @param board - Datos del board a crear
   * @returns Observable<Board>
   */
  create(board: CreateBoardRequest): Observable<Board> {
    return this.http.post<Board>(this.API_URL, board).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza un board existente
   * PUT /api/v1/boards/:id
   * @param id - ID del board
   * @param board - Datos actualizados del board
   * @returns Observable<Board>
   */
  update(id: string, board: UpdateBoardRequest): Observable<Board> {
    return this.http.put<Board>(`${this.API_URL}/${id}`, board).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina un board
   * DELETE /api/v1/boards/:id
   * @param id - ID del board a eliminar
   * @returns Observable<void>
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Maneja errores HTTP
   * @private
   */
  private handleError(error: any): Observable<never> {
    console.error('Board Service Error:', error);
    
    // Estructura de error estándar del backend
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
