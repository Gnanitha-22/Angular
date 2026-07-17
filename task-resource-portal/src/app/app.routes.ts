import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { ProjectsResolver } from './core/resolvers/projects.resolver';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'users', canActivate: [roleGuard], data: { role: 'Admin' }, loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent) },
      { path: 'projects', canActivate: [roleGuard], data: { role: ['Admin', 'Project Manager'] }, resolve: { projects: ProjectsResolver }, loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent) },
      { path: 'tasks', canActivate: [roleGuard], data: { role: ['Admin', 'Project Manager', 'Team Member'] }, loadComponent: () => import('./features/tasks/tasks.component').then(m => m.TasksComponent) },
      { path: 'tasks/kanban', canActivate: [roleGuard], data: { role: ['Admin', 'Project Manager', 'Team Member'] }, loadComponent: () => import('./features/tasks/kanban.component').then(m => m.TaskKanbanComponent) },
      { path: 'resources', canActivate: [roleGuard], data: { role: ['Admin', 'Project Manager'] }, loadComponent: () => import('./features/resources/resources.component').then(m => m.ResourcesComponent) },
      { path: 'reports', canActivate: [roleGuard], data: { role: 'Admin' }, loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent) }
    ]
  }
];
