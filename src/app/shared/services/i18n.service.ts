import { Injectable, inject, computed } from '@angular/core';
import { ThemeService, Language } from './theme.service';

interface Translations {
  [key: string]: {
    en: string;
    es: string;
  };
}

/**
 * I18nService - Servicio de internacionalización
 * Traducciones para Login, Register y elementos comunes
 */
@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private themeService = inject(ThemeService);

  // Signal computado para obtener idioma actual
  public currentLanguage = this.themeService.currentLanguage;

  // Diccionario de traducciones
  private translations: Translations = {
    // Login
    'login.title': { en: 'Welcome Back', es: 'Bienvenido de Nuevo' },
    'login.subtitle': { en: 'Sign in to continue to your dashboard', es: 'Inicia sesión para continuar a tu panel' },
    'login.email': { en: 'Email Address', es: 'Correo Electrónico' },
    'login.password': { en: 'Password', es: 'Contraseña' },
    'login.emailPlaceholder': { en: 'you@example.com', es: 'tu@ejemplo.com' },
    'login.passwordPlaceholder': { en: 'Enter your password', es: 'Ingresa tu contraseña' },
    'login.forgotPassword': { en: 'Forgot password?', es: '¿Olvidaste tu contraseña?' },
    'login.signIn': { en: 'Sign In', es: 'Iniciar Sesión' },
    'login.signingIn': { en: 'Signing in...', es: 'Iniciando sesión...' },
    'login.or': { en: 'or', es: 'o' },
    'login.noAccount': { en: "Don't have an account?", es: '¿No tienes una cuenta?' },
    'login.createOne': { en: 'Create one', es: 'Crear una' },
    'login.emailRequired': { en: 'Email is required', es: 'El correo es requerido' },
    'login.emailInvalid': { en: 'Please enter a valid email address', es: 'Ingresa un correo válido' },
    'login.passwordRequired': { en: 'Password is required', es: 'La contraseña es requerida' },
    'login.passwordMinLength': { en: 'Password must be at least 6 characters', es: 'La contraseña debe tener al menos 6 caracteres' },

    // Register
    'register.brand': { en: 'Join Planify', es: 'Únete a Planify' },
    'register.brandSubtitle': { en: 'Start managing your projects today', es: 'Comienza a gestionar tus proyectos hoy' },
    'register.title': { en: 'Create Account', es: 'Crear Cuenta' },
    'register.subtitle': { en: 'Fill in your details to get started', es: 'Completa tus datos para comenzar' },
    'register.firstName': { en: 'First Name', es: 'Nombre' },
    'register.lastName': { en: 'Last Name', es: 'Apellido' },
    'register.email': { en: 'Email Address', es: 'Correo Electrónico' },
    'register.password': { en: 'Password', es: 'Contraseña' },
    'register.firstNamePlaceholder': { en: 'John', es: 'Juan' },
    'register.lastNamePlaceholder': { en: 'Doe', es: 'Pérez' },
    'register.emailPlaceholder': { en: 'you@example.com', es: 'tu@ejemplo.com' },
    'register.passwordPlaceholder': { en: 'Create a strong password', es: 'Crea una contraseña fuerte' },
    'register.passwordHint': { en: 'Use at least 8 characters with letters and numbers', es: 'Usa al menos 8 caracteres con letras y números' },
    'register.weakPassword': { en: 'Weak', es: 'Débil' },
    'register.mediumPassword': { en: 'Medium', es: 'Media' },
    'register.strongPassword': { en: 'Strong', es: 'Fuerte' },
    'register.terms': { en: 'By creating an account, you agree to our Terms of Service and Privacy Policy', es: 'Al crear una cuenta, aceptas nuestros Términos de Servicio y Política de Privacidad' },
    'register.createAccount': { en: 'Create Account', es: 'Crear Cuenta' },
    'register.creatingAccount': { en: 'Creating account...', es: 'Creando cuenta...' },
    'register.orSignUpWith': { en: 'or sign up with', es: 'o regístrate con' },
    'register.haveAccount': { en: 'Already have an account?', es: '¿Ya tienes una cuenta?' },
    'register.signIn': { en: 'Sign in', es: 'Iniciar sesión' },
    'register.firstNameRequired': { en: 'First name is required', es: 'El nombre es requerido' },
    'register.lastNameRequired': { en: 'Last name is required', es: 'El apellido es requerido' },
    'register.emailRequired': { en: 'Email is required', es: 'El correo es requerido' },
    'register.emailInvalid': { en: 'Please enter a valid email address', es: 'Ingresa un correo válido' },
    'register.passwordRequired': { en: 'Password is required', es: 'La contraseña es requerida' },
    'register.passwordMinLength': { en: 'Password must be at least 8 characters', es: 'La contraseña debe tener al menos 8 caracteres' },

    // Common
    'common.google': { en: 'Google', es: 'Google' },
    'common.github': { en: 'GitHub', es: 'GitHub' },
    'common.apple': { en: 'Apple', es: 'Apple' },
    'common.facebook': { en: 'Facebook', es: 'Facebook' },
    'common.microsoft': { en: 'Microsoft', es: 'Microsoft' },
    'common.privacyPolicy': { en: 'Privacy Policy', es: 'Política de Privacidad' },
    'common.termsOfService': { en: 'Terms of Service', es: 'Términos de Servicio' },
    'common.help': { en: 'Help', es: 'Ayuda' },
    'common.allRightsReserved': { en: 'All rights reserved', es: 'Todos los derechos reservados' },
    'common.darkMode': { en: 'Dark Mode', es: 'Modo Oscuro' },
    'common.lightMode': { en: 'Light Mode', es: 'Modo Claro' },
    'common.language': { en: 'Language', es: 'Idioma' },

    // Layout & Navigation
    'layout.menu': { en: 'Menu', es: 'Menú' },
    'layout.boards': { en: 'Boards', es: 'Tableros' },
    'layout.notes': { en: 'Notes', es: 'Notas' },
    'layout.admin': { en: 'Admin', es: 'Administración' },
    'layout.profile': { en: 'My Profile', es: 'Mi Perfil' },
    'layout.settings': { en: 'Settings', es: 'Configuración' },
    'layout.logout': { en: 'Sign Out', es: 'Cerrar Sesión' },
    'layout.navigation': { en: 'Navigation', es: 'Navegación' },
    'layout.user': { en: 'User', es: 'Usuario' },
    'layout.version': { en: 'Version', es: 'Versión' },
    'layout.copyright': { en: 'All rights reserved', es: 'Todos los derechos reservados' },
    'layout.switchToEnglish': { en: 'Switch to English', es: 'Cambiar a Inglés' },
    'layout.switchToSpanish': { en: 'Switch to Spanish', es: 'Cambiar a Español' },

    // Tooltips
    'tooltip.menu': { en: 'Open menu', es: 'Abrir menú' },
    'tooltip.theme': { en: 'Toggle theme', es: 'Cambiar tema' },
    'tooltip.language': { en: 'Change language', es: 'Cambiar idioma' },
    'tooltip.userMenu': { en: 'User menu', es: 'Menú de usuario' },
    'tooltip.close': { en: 'Close', es: 'Cerrar' },
    'tooltip.edit': { en: 'Edit', es: 'Editar' },
    'tooltip.delete': { en: 'Delete', es: 'Eliminar' },
    'tooltip.save': { en: 'Save', es: 'Guardar' },
    'tooltip.cancel': { en: 'Cancel', es: 'Cancelar' },
    'tooltip.add': { en: 'Add', es: 'Agregar' },
    'tooltip.search': { en: 'Search', es: 'Buscar' },
    'tooltip.filter': { en: 'Filter', es: 'Filtrar' },
    'tooltip.refresh': { en: 'Refresh', es: 'Actualizar' },

    // Confirmations
    'confirm.title': { en: 'Confirm Action', es: 'Confirmar Acción' },
    'confirm.delete': { en: 'Delete Confirmation', es: 'Confirmación de Eliminación' },
    'confirm.deleteMessage': { en: 'Are you sure you want to delete this item? This action cannot be undone.', es: '¿Estás seguro de eliminar este elemento? Esta acción no se puede deshacer.' },
    'confirm.yes': { en: 'Yes, delete', es: 'Sí, eliminar' },
    'confirm.no': { en: 'Cancel', es: 'Cancelar' },
    'confirm.logout': { en: 'Are you sure you want to log out?', es: '¿Estás seguro de cerrar sesión?' },
    'confirm.unsavedChanges': { en: 'You have unsaved changes. Do you want to discard them?', es: 'Tienes cambios sin guardar. ¿Deseas descartarlos?' },
  };

  /**
   * Obtiene una traducción por su clave
   */
  public t(key: string): string {
    const translation = this.translations[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }

    const lang = this.currentLanguage();
    return translation[lang] || translation.en;
  }

  /**
   * Computed signal para traducción reactiva
   */
  public translate(key: string) {
    return computed(() => this.t(key));
  }
}
