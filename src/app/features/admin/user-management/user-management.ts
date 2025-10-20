import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

// Services
import { AdminService, User, UpdateUserRequest } from '../../../shared/services/admin.service';
import { TranslationService } from '../../../shared/services/i18n/translation.service';
import { AppConfirmationService } from '../../../shared/services/confirmation.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    Select,
    ToastModule,
    TagModule,
    TooltipModule,
    ToggleSwitch,
    ConfirmDialogModule
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css',
  providers: [MessageService, ConfirmationService]
})
export class UserManagement implements OnInit {
  private adminService = inject(AdminService);
  private messageService = inject(MessageService);
  private confirmationService = inject(AppConfirmationService);
  protected i18n = inject(TranslationService);

  // State
  protected users = signal<User[]>([]);
  protected isLoading = signal(false);
  protected hasError = signal(false);

  // Dialog state
  protected showUserDialog = signal(false);
  protected isEditingUser = signal(false);
  protected isSavingUser = signal(false);
  protected currentUser = signal<User | null>(null);

  // Form
  protected userFirstName = signal('');
  protected userLastName = signal('');
  protected userRole = signal<'Admin' | 'User' | 'Manager' | 'Guest'>('User');
  protected userIsActive = signal(true);

  // Dropdown options
  protected roleOptions = [
    { label: 'Admin', value: 'Admin' },
    { label: 'Manager', value: 'Manager' },
    { label: 'User', value: 'User' },
    { label: 'Guest', value: 'Guest' }
  ];

  ngOnInit(): void {
    this.loadUsers();
  }

  /**
   * Carga todos los usuarios
   */
  protected loadUsers(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.adminService.getAllUsers().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.hasError.set(true);
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
      }
    });
  }

  /**
   * Abre el diálogo para editar un usuario
   */
  protected openEditUserDialog(user: User): void {
    this.isEditingUser.set(true);
    this.currentUser.set(user);
    this.userFirstName.set(user.firstName);
    this.userLastName.set(user.lastName);
    this.userRole.set(user.role);
    this.userIsActive.set(user.isActive);
    this.showUserDialog.set(true);
  }

  /**
   * Cierra el diálogo de usuario
   */
  protected closeUserDialog(): void {
    this.showUserDialog.set(false);
    this.currentUser.set(null);
    this.userFirstName.set('');
    this.userLastName.set('');
    this.userRole.set('User');
    this.userIsActive.set(true);
  }

  /**
   * Guarda los cambios del usuario
   */
  protected saveUser(): void {
    const currentUser = this.currentUser();
    if (!currentUser) return;

    const firstName = this.userFirstName().trim();
    const lastName = this.userLastName().trim();

    if (!firstName || !lastName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'First name and last name are required'
      });
      return;
    }

    this.isSavingUser.set(true);

    const request: UpdateUserRequest = {
      firstName,
      lastName,
      role: this.userRole(),
      isActive: this.userIsActive()
    };

    this.adminService.updateUser(currentUser.id, request).subscribe({
      next: (updatedUser) => {
        this.users.update(users =>
          users.map(u => u.id === updatedUser.id ? updatedUser : u)
        );
        this.closeUserDialog();
        this.isSavingUser.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User updated successfully'
        });
      },
      error: (error) => {
        console.error('Error updating user:', error);
        this.isSavingUser.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to update user'
        });
      }
    });
  }

  /**
   * Elimina un usuario
   */
  protected deleteUser(user: User): void {
    this.confirmationService.confirmDelete({
      itemName: user.email,
      onConfirm: () => {
        this.adminService.deleteUser(user.id).subscribe({
          next: () => {
            this.users.update(users => users.filter(u => u.id !== user.id));
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User deleted successfully'
            });
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.message || 'Failed to delete user'
            });
          }
        });
      }
    });
  }

  /**
   * Obtiene el color del tag de rol
   */
  protected getRoleSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' {
    switch (role) {
      case 'Admin':
        return 'danger';
      case 'Manager':
        return 'warn';
      case 'User':
        return 'info';
      case 'Guest':
        return 'success';
      default:
        return 'info';
    }
  }

  /**
   * Formatea la fecha
   */
  protected formatDate(dateString: string | null): string {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
