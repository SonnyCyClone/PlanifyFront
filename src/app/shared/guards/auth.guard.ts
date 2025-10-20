import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

/**
 * Guard para proteger rutas que requieren autenticación
 * Valida token localmente para mejor persistencia al refrescar
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si no hay token o es inválido, redirigir a login
  if (!authService.isAuthenticated()) {
    const returnUrl = state.url;
    router.navigate(['/auth/login'], { queryParams: { returnUrl } });
    return false;
  }

  // Si ya tenemos usuario en memoria, permitir acceso inmediato
  if (authService.currentUser()) {
    return true;
  }

  // Solo si no hay usuario en memoria, validar con backend
  return authService.getCurrentUser().pipe(
    map(() => true),
    catchError(() => {
      // Si falla la validación, redirigir a login
      const returnUrl = state.url;
      router.navigate(['/auth/login'], { queryParams: { returnUrl } });
      return of(false);
    })
  );
};

/**
 * Guard para proteger rutas de administración
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdminUser()) {
    return true;
  }

  // Si no es admin, redirigir al dashboard
  router.navigate(['/boards']);
  return false;
};

/**
 * Guard para páginas públicas (login, register)
 * Redirige al dashboard si ya está autenticado
 */
export const publicGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/boards']);
    return false;
  }

  return true;
};
