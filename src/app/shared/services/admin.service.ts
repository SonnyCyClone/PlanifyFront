import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay } from 'rxjs/operators';

/**
 * AdminService - Gestión de administración
 * 
 * NOTA: Este servicio usa datos simulados ya que no hay endpoints
 * de admin en la API actual. En producción, conectar a endpoints reales.
 */

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalBoards: number;
  totalTasks: number;
  totalNotes: number;
  completedTasks: number;
  userGrowth: number; // Porcentaje
  taskCompletionRate: number; // Porcentaje
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'Admin' | 'User' | 'Manager' | 'Guest';
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: 'Admin' | 'User' | 'Manager' | 'Guest';
  isActive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/v1/admin';

  /**
   * Obtiene estadísticas del dashboard
   * TODO: Conectar a endpoint real cuando esté disponible
   */
  getDashboardStats(): Observable<DashboardStats> {
    // Datos simulados
    const stats: DashboardStats = {
      totalUsers: 47,
      activeUsers: 42,
      totalBoards: 156,
      totalTasks: 1234,
      totalNotes: 89,
      completedTasks: 856,
      userGrowth: 12.5,
      taskCompletionRate: 69.4
    };

    return of(stats).pipe(delay(800));
  }

  /**
   * Obtiene todos los usuarios (solo Admin)
   * TODO: Conectar a endpoint real cuando esté disponible
   */
  getAllUsers(): Observable<User[]> {
    // Datos simulados
    const users: User[] = [
      {
        id: '1',
        email: 'admin@planify.local',
        firstName: 'Admin',
        lastName: 'User',
        role: 'Admin',
        isActive: true,
        createdAt: '2025-01-01T00:00:00Z',
        lastLoginAt: '2025-10-19T10:00:00Z'
      },
      {
        id: '2',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'User',
        isActive: true,
        createdAt: '2025-02-15T00:00:00Z',
        lastLoginAt: '2025-10-18T15:30:00Z'
      },
      {
        id: '3',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'Manager',
        isActive: true,
        createdAt: '2025-03-10T00:00:00Z',
        lastLoginAt: '2025-10-19T09:15:00Z'
      },
      {
        id: '4',
        email: 'inactive@example.com',
        firstName: 'Inactive',
        lastName: 'User',
        role: 'User',
        isActive: false,
        createdAt: '2025-04-20T00:00:00Z',
        lastLoginAt: '2025-09-01T12:00:00Z'
      }
    ];

    return of(users).pipe(delay(1000));
  }

  /**
   * Actualiza un usuario
   * TODO: Conectar a endpoint real cuando esté disponible
   */
  updateUser(userId: string, request: UpdateUserRequest): Observable<User> {
    // Simulación de actualización
    return of({
      id: userId,
      email: 'updated@example.com',
      firstName: request.firstName || 'Updated',
      lastName: request.lastName || 'User',
      role: request.role || 'User',
      isActive: request.isActive !== undefined ? request.isActive : true,
      createdAt: '2025-01-01T00:00:00Z',
      lastLoginAt: '2025-10-19T10:00:00Z'
    } as User).pipe(delay(500));
  }

  /**
   * Elimina un usuario
   * TODO: Conectar a endpoint real cuando esté disponible
   */
  deleteUser(userId: string): Observable<void> {
    return of(void 0).pipe(delay(500));
  }

  /**
   * Manejo de errores centralizado
   */
  private handleError(error: any): Observable<never> {
    console.error('AdminService Error:', error);
    
    let errorMessage = 'An error occurred';
    
    if (error.error) {
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
