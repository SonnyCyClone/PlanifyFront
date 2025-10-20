import { Injectable, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { I18nService } from './i18n.service';

/**
 * ConfirmationService - Servicio profesional para confirmaciones
 * Reemplaza los confirm() nativos del navegador con PrimeNG ConfirmDialog
 */
@Injectable({
  providedIn: 'root'
})
export class AppConfirmationService {
  private confirmationService = inject(ConfirmationService);
  private i18n = inject(I18nService);

  /**
   * Muestra un diálogo de confirmación genérico
   */
  confirm(options: {
    message: string;
    header?: string;
    icon?: string;
    accept?: () => void;
    reject?: () => void;
  }): void {
    this.confirmationService.confirm({
      message: options.message,
      header: options.header || this.i18n.t('confirm.title'),
      icon: options.icon || 'pi pi-exclamation-triangle',
      acceptLabel: this.i18n.t('confirm.yes'),
      rejectLabel: this.i18n.t('confirm.no'),
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: options.accept,
      reject: options.reject,
      defaultFocus: 'reject' // Más seguro - el usuario debe confirmar explícitamente
    });
  }

  /**
   * Confirmación específica para eliminación
   */
  confirmDelete(options: {
    itemName: string;
    onConfirm: () => void;
    onCancel?: () => void;
  }): void {
    const message = `${this.i18n.t('confirm.deleteMessage')} "${options.itemName}"?`;
    
    this.confirmationService.confirm({
      message,
      header: this.i18n.t('confirm.delete'),
      icon: 'pi pi-trash',
      acceptLabel: this.i18n.t('confirm.yes'),
      rejectLabel: this.i18n.t('confirm.no'),
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: options.onConfirm,
      reject: options.onCancel,
      defaultFocus: 'reject'
    });
  }

  /**
   * Confirmación para cerrar sesión
   */
  confirmLogout(options: {
    onConfirm: () => void;
    onCancel?: () => void;
  }): void {
    this.confirmationService.confirm({
      message: this.i18n.t('confirm.logout'),
      header: this.i18n.t('layout.logout'),
      icon: 'pi pi-sign-out',
      acceptLabel: this.i18n.t('confirm.yes'),
      rejectLabel: this.i18n.t('confirm.no'),
      acceptButtonStyleClass: 'p-button-warning',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: options.onConfirm,
      reject: options.onCancel,
      defaultFocus: 'reject'
    });
  }

  /**
   * Confirmación para cambios sin guardar
   */
  confirmUnsavedChanges(options: {
    onConfirm: () => void;
    onCancel?: () => void;
  }): void {
    this.confirmationService.confirm({
      message: this.i18n.t('confirm.unsavedChanges'),
      header: this.i18n.t('confirm.title'),
      icon: 'pi pi-exclamation-circle',
      acceptLabel: this.i18n.t('confirm.yes'),
      rejectLabel: this.i18n.t('confirm.no'),
      acceptButtonStyleClass: 'p-button-warning',
      rejectButtonStyleClass: 'p-button-secondary p-button-outlined',
      accept: options.onConfirm,
      reject: options.onCancel,
      defaultFocus: 'reject'
    });
  }
}
