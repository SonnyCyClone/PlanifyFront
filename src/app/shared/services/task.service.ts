import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  MoveTaskRequest,
  TaskQueryParams,
  PaginatedTaskResponse
} from '../models';

/**
 * Task Service - Gestión de tareas en boards
 * API Endpoints: /api/v1/boards/:boardId/tasks
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = '/api/v1/boards';

  /**
   * Obtiene todas las tareas de un board (con paginación y filtros)
   * GET /api/v1/boards/:boardId/tasks
   * @param boardId - ID del board
   * @param params - Parámetros de consulta (paginación, filtros)
   * @returns Observable<PaginatedTaskResponse>
   */
  getAll(boardId: string, params?: TaskQueryParams): Observable<PaginatedTaskResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.tag) httpParams = httpParams.set('tag', params.tag);
      if (params.assignedUserId) httpParams = httpParams.set('assignedUserId', params.assignedUserId);
      if (params.status) httpParams = httpParams.set('status', params.status);
      if (params.from) httpParams = httpParams.set('from', params.from);
      if (params.to) httpParams = httpParams.set('to', params.to);
    }

    return this.http.get<PaginatedTaskResponse>(`${this.API_URL}/${boardId}/tasks`, { params: httpParams }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una tarea por ID
   * GET /api/v1/boards/:boardId/tasks/:taskId
   * @param boardId - ID del board
   * @param taskId - ID de la tarea
   * @returns Observable<Task>
   */
  getById(boardId: string, taskId: string): Observable<Task> {
    return this.http.get<Task>(`${this.API_URL}/${boardId}/tasks/${taskId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva tarea
   * POST /api/v1/boards/:boardId/tasks
   */
  create(boardId: string, task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${this.API_URL}/${boardId}/tasks`, task).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una tarea existente
   * PUT /api/v1/boards/:boardId/tasks/:taskId
   * Nota: NO cambia la columna. Usa moveTask() para cambiar de columna
   * @param boardId - ID del board
   * @param taskId - ID de la tarea
   * @param task - Datos actualizados de la tarea
   * @returns Observable<Task>
   */
  update(boardId: string, taskId: string, task: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.API_URL}/${boardId}/tasks/${taskId}`, task).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Mueve una tarea a otra columna y/o posición
   * PATCH /api/v1/boards/:boardId/tasks/:taskId/move
   * @param boardId - ID del board
   * @param taskId - ID de la tarea
   * @param request - Nueva columna y posición
   * @returns Observable<Task>
   */
  move(boardId: string, taskId: string, request: MoveTaskRequest): Observable<Task> {
    return this.http.patch<Task>(`${this.API_URL}/${boardId}/tasks/${taskId}/move`, request).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina una tarea
   * DELETE /api/v1/boards/:boardId/tasks/:taskId
   * @param boardId - ID del board
   * @param taskId - ID de la tarea a eliminar
   * @returns Observable<void>
   */
  delete(boardId: string, taskId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${boardId}/tasks/${taskId}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Maneja errores HTTP
   * @private
   */
  private handleError(error: any): Observable<never> {
    console.error('Task Service Error:', error);
    
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
