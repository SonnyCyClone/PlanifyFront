import { inject } from '@angular/core';
import type { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

// Variable para controlar si estamos renovando el token
let isRefreshing = false;
// Subject para notificar cuando el token se renovó
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

/**
 * Interceptor HTTP para agregar el token de autenticación
 * y manejar el refresh automático con cola de peticiones
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  // No interceptar requests de autenticación
  if (
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/health')
  ) {
    return next(req);
  }

  const token = tokenService.getAccessToken();

  // Si no hay token, continuar sin modificar
  if (!token) {
    return next(req);
  }

  // Agregar el token al header
  const clonedReq = addTokenToRequest(req, token);

  return next(clonedReq).pipe(
    catchError((error) => {
      // Si recibimos 401 Unauthorized
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return handle401Error(req, next, authService, tokenService);
      }

      return throwError(() => error);
    })
  );
};

/**
 * Agrega el token de autorización a la petición
 */
function addTokenToRequest(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Maneja el error 401 con refresh automático y cola de peticiones
 */
function handle401Error(
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn, 
  authService: AuthService, 
  tokenService: TokenService
): Observable<any> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        refreshTokenSubject.next(response.accessToken);
        
        // Reintentar la petición original con el nuevo token
        return next(addTokenToRequest(req, response.accessToken));
      }),
      catchError((refreshError) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => refreshError);
      })
    );
  } else {
    // Si ya estamos refrescando el token, esperar a que termine
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next(addTokenToRequest(req, token!));
      })
    );
  }
}
