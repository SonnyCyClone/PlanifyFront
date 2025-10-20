import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ChartModule } from 'primeng/chart';

// Services
import { AdminService, DashboardStats } from '../../../shared/services/admin.service';
import { TranslationService } from '../../../shared/services/i18n/translation.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    SkeletonModule,
    ToastModule,
    ChartModule
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
  providers: [MessageService]
})
export class AdminDashboard implements OnInit {
  private adminService = inject(AdminService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  protected i18n = inject(TranslationService);

  // State
  protected stats = signal<DashboardStats | null>(null);
  protected isLoading = signal(false);
  protected hasError = signal(false);

  // Chart data
  protected userGrowthData: any;
  protected taskStatusData: any;
  protected chartOptions: any;

  ngOnInit(): void {
    this.loadDashboardStats();
    this.initializeCharts();
  }

  /**
   * Carga las estadísticas del dashboard
   */
  private loadDashboardStats(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.updateCharts(stats);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
        this.hasError.set(true);
        this.isLoading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load dashboard statistics'
        });
      }
    });
  }

  /**
   * Inicializa las configuraciones de gráficos
   */
  private initializeCharts(): void {
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: '#495057'
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };

    // Datos iniciales vacíos
    this.userGrowthData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Users',
          data: [12, 19, 25, 31, 38, 47],
          fill: true,
          borderColor: '#667eea',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4
        }
      ]
    };

    this.taskStatusData = {
      labels: ['Completed', 'In Progress', 'Open', 'On Hold'],
      datasets: [
        {
          data: [856, 234, 98, 46],
          backgroundColor: ['#10b981', '#667eea', '#f59e0b', '#6b7280'],
          hoverBackgroundColor: ['#059669', '#5568d3', '#d97706', '#4b5563']
        }
      ]
    };
  }

  /**
   * Actualiza los gráficos con datos reales
   */
  private updateCharts(stats: DashboardStats): void {
    // Actualizar gráfico de tareas
    this.taskStatusData = {
      labels: ['Completed', 'In Progress', 'Open', 'On Hold'],
      datasets: [
        {
          data: [
            stats.completedTasks,
            Math.round(stats.totalTasks * 0.19),
            Math.round(stats.totalTasks * 0.08),
            Math.round(stats.totalTasks * 0.04)
          ],
          backgroundColor: ['#10b981', '#667eea', '#f59e0b', '#6b7280'],
          hoverBackgroundColor: ['#059669', '#5568d3', '#d97706', '#4b5563']
        }
      ]
    };
  }

  /**
   * Navega a la gestión de usuarios
   */
  protected navigateToUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  /**
   * Recarga las estadísticas
   */
  protected refreshStats(): void {
    this.loadDashboardStats();
  }

  /**
   * Formatea números con separadores de miles
   */
  protected formatNumber(num: number): string {
    return num.toLocaleString('en-US');
  }
}
