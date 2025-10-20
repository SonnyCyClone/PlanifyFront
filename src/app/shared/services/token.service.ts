import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string; // userId
  email: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  exp: number; // expiration timestamp
  iss: string;
  aud: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ACCESS_TOKEN_KEY = 'planify_access_token';
  private readonly REFRESH_TOKEN_KEY = 'planify_refresh_token';
  private readonly EXPIRES_AT_KEY = 'planify_expires_at';

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /**
   * Guarda el access token en localStorage
   */
  setAccessToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
    }
  }

  /**
   * Obtiene el access token de localStorage
   */
  getAccessToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }
    return null;
  }

  /**
   * Guarda el refresh token en localStorage
   */
  setRefreshToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }
  }

  /**
   * Obtiene el refresh token de localStorage
   */
  getRefreshToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  /**
   * Guarda la fecha de expiración
   */
  setExpiresAt(expiresAt: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt);
    }
  }

  /**
   * Obtiene la fecha de expiración
   */
  getExpiresAt(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this.EXPIRES_AT_KEY);
    }
    return null;
  }

  /**
   * Elimina todos los tokens (logout)
   */
  clearTokens(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.EXPIRES_AT_KEY);
    }
  }

  /**
   * Verifica si el token actual es válido
   */
  isTokenValid(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Date.now() / 1000;
      return decoded.exp > now;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica si el token está próximo a expirar (menos de 5 minutos)
   */
  isTokenExpiringSoon(): boolean {
    const token = this.getAccessToken();
    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Date.now() / 1000;
      const fiveMinutes = 5 * 60;
      return decoded.exp - now < fiveMinutes;
    } catch (error) {
      return false;
    }
  }

  /**
   * Decodifica el token y obtiene el payload
   */
  decodeToken(): JwtPayload | null {
    const token = this.getAccessToken();
    if (!token) {
      return null;
    }

    try {
      return jwtDecode<JwtPayload>(token);
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtiene el userId del token
   */
  getUserId(): string | null {
    const payload = this.decodeToken();
    return payload?.sub || null;
  }

  /**
   * Obtiene el email del token
   */
  getEmail(): string | null {
    const payload = this.decodeToken();
    return payload?.email || null;
  }

  /**
   * Obtiene el rol del token
   */
  getRole(): string | null {
    const payload = this.decodeToken();
    return payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  }
}
