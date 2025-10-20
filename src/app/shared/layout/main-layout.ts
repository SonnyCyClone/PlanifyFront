import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../services/auth.service';
import { I18nService } from '../services/i18n.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MenubarModule,
    AvatarModule,
    ButtonModule,
    MenuModule,
    TooltipModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayout {
  private authService = inject(AuthService);
  private router = inject(Router);
  protected i18n = inject(I18nService);
  protected themeService = inject(ThemeService);

  // State
  protected currentUser = this.authService.currentUser;
  protected isAdmin = this.authService.isAdmin;
  protected isSidebarOpen = signal(false);

  // Menu items para el dropdown de usuario (reactivo a i18n)
  protected get userMenuItems(): MenuItem[] {
    return [
      {
        label: this.i18n.t('layout.profile'),
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/profile'])
      },
      {
        label: this.i18n.t('layout.settings'),
        icon: 'pi pi-cog',
        command: () => this.router.navigate(['/settings'])
      },
      {
        separator: true
      },
      {
        label: this.i18n.t('layout.logout'),
        icon: 'pi pi-sign-out',
        command: () => this.logout()
      }
    ];
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  toggleLanguage(): void {
    this.themeService.toggleLanguage();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(value => !value);
  }

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return 'U';
    
    const firstInitial = user.firstName?.charAt(0).toUpperCase() || '';
    const lastInitial = user.lastName?.charAt(0).toUpperCase() || '';
    
    return firstInitial + lastInitial || 'U';
  }

  getUserFullName(): string {
    const user = this.currentUser();
    if (!user) return 'Usuario';
    
    return `${user.firstName} ${user.lastName}`.trim() || 'Usuario';
  }
}
