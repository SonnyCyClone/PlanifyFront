import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Note, CreateNoteRequest, UpdateNoteRequest } from '../models/note.models';

/**
 * NoteService - Gestión de notas
 * 
 * API: /api/v1/notes
 * Operaciones CRUD completas para notas del usuario
 */
@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/v1/notes';

  /**
   * Obtiene todas las notas del usuario actual
   * GET /api/v1/notes
   */
  getAll(): Observable<Note[]> {
    return this.http.get<Note[]>(this.API_URL).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtiene una nota por ID
   * GET /api/v1/notes/:id
   */
  getById(id: string): Observable<Note> {
    return this.http.get<Note>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crea una nueva nota
   * POST /api/v1/notes
   * 
   * Body:
   * {
   *   "title": "Sprint Planning Notes",
   *   "content": "## Objectives\n- Complete user authentication",
   *   "tags": ["sprint", "planning"]
   * }
   */
  create(request: CreateNoteRequest): Observable<Note> {
    return this.http.post<Note>(this.API_URL, request).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualiza una nota existente
   * PUT /api/v1/notes/:id
   * 
   * Body:
   * {
   *   "title": "Updated title",
   *   "content": "Updated content",
   *   "tags": ["updated"]
   * }
   */
  update(id: string, request: UpdateNoteRequest): Observable<Note> {
    return this.http.put<Note>(`${this.API_URL}/${id}`, request).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Elimina una nota
   * DELETE /api/v1/notes/:id
   */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores centralizado
   */
  private handleError(error: any): Observable<never> {
    console.error('NoteService Error:', error);
    
    let errorMessage = 'An error occurred';
    
    if (error.error) {
      // Backend error con mensaje
      if (error.error.error) {
        errorMessage = error.error.error;
      } else if (error.error.detail) {
        errorMessage = error.error.detail;
      } else if (error.error.title) {
        errorMessage = error.error.title;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
