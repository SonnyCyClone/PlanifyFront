import { inject } from '@angular/core';
import type { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

/**
 * Interceptor para manejar errores HTTP globalmente
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      console.error('HTTP Error:', error);

      // Manejar diferentes códigos de error
      switch (error.status) {
        case 401:
          // Unauthorized - ya se maneja en authInterceptor
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden');
          router.navigate(['/boards']);
          break;
        case 404:
          // Not Found
          console.error('Resource not found');
          break;
        case 500:
          // Server Error
          console.error('Internal server error');
          break;
        default:
          console.error('Unknown error occurred');
      }

      return throwError(() => error);
    })
  );
};
