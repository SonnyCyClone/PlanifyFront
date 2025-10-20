import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TRANSLATIONS, Language, TranslationKeys } from './translations';

const LANGUAGE_KEY = 'planify_language';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly currentLanguage = signal<Language>('es'); // Español por defecto
  
  public readonly language = this.currentLanguage.asReadonly();
  public readonly translations = computed(() => TRANSLATIONS[this.currentLanguage()]);

  constructor() {
    this.loadLanguage();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private loadLanguage(): void {
    if (this.isBrowser()) {
      const savedLang = localStorage.getItem(LANGUAGE_KEY) as Language;
      if (savedLang && (savedLang === 'es' || savedLang === 'en')) {
        this.currentLanguage.set(savedLang);
      }
    }
  }

  setLanguage(lang: Language): void {
    this.currentLanguage.set(lang);
    if (this.isBrowser()) {
      localStorage.setItem(LANGUAGE_KEY, lang);
    }
  }

  toggleLanguage(): void {
    const newLang: Language = this.currentLanguage() === 'es' ? 'en' : 'es';
    this.setLanguage(newLang);
  }

  // Helper methods para acceso fácil
  get t(): TranslationKeys {
    return this.translations();
  }

  get isSpanish(): boolean {
    return this.currentLanguage() === 'es';
  }

  get isEnglish(): boolean {
    return this.currentLanguage() === 'en';
  }
}
