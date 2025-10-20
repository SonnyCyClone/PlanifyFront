import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SessionRefreshService } from './shared/services/session-refresh.service';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DialogModule, ButtonModule, ConfirmDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('FrontPlanify');
  protected sessionRefreshService = inject(SessionRefreshService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    // Iniciar el monitoreo de sesión si el usuario está autenticado
    if (this.authService.isAuthenticated()) {
      this.sessionRefreshService.startMonitoring();
    }
  }

  ngOnDestroy(): void {
    this.sessionRefreshService.stopMonitoring();
  }

  /**
   * El usuario confirma que quiere continuar
   */
  protected onConfirmRefresh(): void {
    this.sessionRefreshService.confirmRefresh();
  }

  /**
   * El usuario cancela o cierra sesión
   */
  protected onCancelRefresh(): void {
    this.sessionRefreshService.cancelRefresh();
  }
}
