import { Injectable, inject, signal } from '@angular/core';
import { interval, Subject, takeUntil, filter } from 'rxjs';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';

/**
 * Servicio para manejar la renovación proactiva de sesión
 * Muestra un diálogo cuando el token está próximo a expirar
 */
@Injectable({
  providedIn: 'root'
})
export class SessionRefreshService {
  private authService = inject(AuthService);
  private tokenService = inject(TokenService);
  
  // Señal para controlar la visibilidad del diálogo
  public showRefreshDialog = signal<boolean>(false);
  
  // Subject para detener el monitoreo
  private destroy$ = new Subject<void>();
  
  // Timer para el cierre automático de sesión (30 minutos)
  private sessionTimeout: any = null;
  private readonly SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutos
  
  // Bandera para evitar múltiples diálogos
  private dialogShown = false;

  constructor() {
    // No iniciamos automáticamente, se inicia desde el app component
  }

  /**
   * Inicia el monitoreo de la sesión
   */
  startMonitoring(): void {
    // Verificar cada 60 segundos si el token está próximo a expirar
    interval(60000) // Cada 60 segundos
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.authService.isAuthenticated())
      )
      .subscribe(() => {
        this.checkTokenExpiration();
      });
  }

  /**
   * Detiene el monitoreo de la sesión
   */
  stopMonitoring(): void {
    this.destroy$.next();
    this.clearSessionTimeout();
  }

  /**
   * Verifica si el token está próximo a expirar
   * Muestra el diálogo si faltan menos de 5 minutos
   */
  private checkTokenExpiration(): void {
    if (this.dialogShown) {
      return; // Ya se mostró el diálogo
    }

    if (this.tokenService.isTokenExpiringSoon()) {
      this.showRefreshDialog.set(true);
      this.dialogShown = true;
      this.startSessionTimeout();
    }
  }

  /**
   * El usuario confirma que quiere continuar
   * Renovamos el token
   */
  confirmRefresh(): void {
    this.authService.refreshToken().subscribe({
      next: () => {
        this.showRefreshDialog.set(false);
        this.dialogShown = false;
        this.clearSessionTimeout();
      },
      error: () => {
        // Si falla el refresh, cerramos sesión
        this.authService.logout();
      }
    });
  }

  /**
   * El usuario cancela o cierra el diálogo
   * Cerramos sesión inmediatamente
   */
  cancelRefresh(): void {
    this.showRefreshDialog.set(false);
    this.dialogShown = false;
    this.clearSessionTimeout();
    this.authService.logout();
  }

  /**
   * Inicia el timer de 30 minutos
   * Si el usuario no responde, cierra sesión automáticamente
   */
  private startSessionTimeout(): void {
    this.clearSessionTimeout();
    
    this.sessionTimeout = setTimeout(() => {
      this.showRefreshDialog.set(false);
      this.dialogShown = false;
      this.authService.logout();
    }, this.SESSION_TIMEOUT_MS);
  }

  /**
   * Limpia el timer de sesión
   */
  private clearSessionTimeout(): void {
    if (this.sessionTimeout) {
      clearTimeout(this.sessionTimeout);
      this.sessionTimeout = null;
    }
  }

  /**
   * Resetea el estado del diálogo
   * Útil después de un login exitoso
   */
  resetDialogState(): void {
    this.dialogShown = false;
    this.showRefreshDialog.set(false);
    this.clearSessionTimeout();
  }
}
