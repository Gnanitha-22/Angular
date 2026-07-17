import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const requiredRole = route.data['role'] as string | string[];
  const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
  const hasRole = allowedRoles.some(role => authService.hasRole(role));
  return hasRole && authService.isTokenValid()
    ? true
    : router.createUrlTree(['/dashboard']);
};
