import { Routes } from '@angular/router';
import { authGuard, adminGuard, publicGuard } from './shared/guards/auth.guard';
import { MainLayout } from './shared/layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/boards',
    pathMatch: 'full'
  },
  // Rutas públicas (Auth)
  {
    path: 'auth',
    canActivate: [publicGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login').then(m => m.Login)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register').then(m => m.Register)
      }
    ]
  },
  // Rutas protegidas con Layout
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'boards',
        loadComponent: () => import('./features/boards/board-list/board-list').then(m => m.BoardList)
      },
      {
        path: 'boards/:id',
        loadComponent: () => import('./features/boards/board-detail/board-detail').then(m => m.BoardDetail)
      },
      {
        path: 'notes',
        loadComponent: () => import('./features/notes/note-list/note-list').then(m => m.NoteList)
      },
      {
        path: 'admin',
        canActivate: [adminGuard],
        children: [
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
          },
          {
            path: 'dashboard',
            loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard').then(m => m.AdminDashboard)
          },
          {
            path: 'users',
            loadComponent: () => import('./features/admin/user-management/user-management').then(m => m.UserManagement)
          }
        ]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/boards'
  }
];
