import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';
export type Language = 'en' | 'es';

/**
 * ThemeService - Gestión de tema claro/oscuro e idioma
 * 
 * - Usa Signals para reactividad
 * - Persistencia en localStorage (SSR-safe)
 * - CSS variables para aplicar estilos
 * - Soporte multiidioma
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private readonly THEME_STORAGE_KEY = 'planify-theme';
  private readonly LANG_STORAGE_KEY = 'planify-language';
  
  // Signals para tema e idioma
  public currentTheme = signal<Theme>('light');
  public currentLanguage = signal<Language>('en');

  constructor() {
    // Cargar tema guardado o detectar preferencia del sistema
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = this.loadThemeFromStorage();
      const systemTheme = this.getSystemTheme();
      const initialTheme = savedTheme || systemTheme;
      
      this.currentTheme.set(initialTheme);
      this.applyTheme(initialTheme);

      // Cargar idioma guardado o detectar del navegador
      const savedLanguage = this.loadLanguageFromStorage();
      const browserLanguage = this.getBrowserLanguage();
      const initialLanguage = savedLanguage || browserLanguage;
      
      this.currentLanguage.set(initialLanguage);
      this.applyLanguage(initialLanguage);

      // Effect para aplicar tema cuando cambie
      effect(() => {
        const theme = this.currentTheme();
        this.applyTheme(theme);
        this.saveThemeToStorage(theme);
      });

      // Effect para aplicar idioma cuando cambie
      effect(() => {
        const language = this.currentLanguage();
        this.applyLanguage(language);
        this.saveLanguageToStorage(language);
      });

      // Escuchar cambios en preferencia del sistema
      this.watchSystemThemeChanges();
    }
  }

  /**
   * Alterna entre tema claro y oscuro
   */
  public toggleTheme(): void {
    const newTheme: Theme = this.currentTheme() === 'light' ? 'dark' : 'light';
    this.currentTheme.set(newTheme);
  }

  /**
   * Establece un tema específico
   */
  public setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  /**
   * Verifica si el tema actual es oscuro
   */
  public isDark(): boolean {
    return this.currentTheme() === 'dark';
  }

  /**
   * Alterna entre idiomas
   */
  public toggleLanguage(): void {
    const newLanguage: Language = this.currentLanguage() === 'en' ? 'es' : 'en';
    this.currentLanguage.set(newLanguage);
  }

  /**
   * Establece un idioma específico
   */
  public setLanguage(language: Language): void {
    this.currentLanguage.set(language);
  }

  /**
   * Aplica el tema al documento
   */
  private applyTheme(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }

    // Actualizar meta theme-color para navegadores móviles
    this.updateMetaThemeColor(theme);
  }

  /**
   * Actualiza el color del tema en navegadores móviles
   */
  private updateMetaThemeColor(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      document.head.appendChild(metaThemeColor);
    }

    const color = theme === 'dark' ? '#1e293b' : '#ffffff';
    metaThemeColor.setAttribute('content', color);
  }

  /**
   * Guarda el tema en localStorage
   */
  private saveThemeToStorage(theme: Theme): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem(this.THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  /**
   * Carga el tema desde localStorage
   */
  private loadThemeFromStorage(): Theme | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    try {
      const savedTheme = localStorage.getItem(this.THEME_STORAGE_KEY);
      return (savedTheme === 'light' || savedTheme === 'dark') ? savedTheme : null;
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
      return null;
    }
  }

  /**
   * Obtiene la preferencia de tema del sistema
   */
  private getSystemTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) return 'light';

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Escucha cambios en la preferencia de tema del sistema
   */
  private watchSystemThemeChanges(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      // Solo actualizar si no hay tema guardado manualmente
      mediaQuery.addEventListener('change', (e) => {
        const savedTheme = this.loadThemeFromStorage();
        if (!savedTheme) {
          const newTheme: Theme = e.matches ? 'dark' : 'light';
          this.currentTheme.set(newTheme);
        }
      });
    }
  }

  /**
   * Aplica el idioma al documento
   */
  private applyLanguage(language: Language): void {
    if (!isPlatformBrowser(this.platformId)) return;
    document.documentElement.setAttribute('lang', language);
  }

  /**
   * Guarda el idioma en localStorage
   */
  private saveLanguageToStorage(language: Language): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem(this.LANG_STORAGE_KEY, language);
    } catch (error) {
      console.warn('Failed to save language to localStorage:', error);
    }
  }

  /**
   * Carga el idioma desde localStorage
   */
  private loadLanguageFromStorage(): Language | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    try {
      const savedLanguage = localStorage.getItem(this.LANG_STORAGE_KEY);
      return (savedLanguage === 'en' || savedLanguage === 'es') ? savedLanguage : null;
    } catch (error) {
      console.warn('Failed to load language from localStorage:', error);
      return null;
    }
  }

  /**
   * Obtiene el idioma del navegador
   */
  private getBrowserLanguage(): Language {
    if (!isPlatformBrowser(this.platformId)) return 'en';

    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'es' ? 'es' : 'en';
  }
}
