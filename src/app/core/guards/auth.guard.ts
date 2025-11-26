import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard que protege rutas requiriendo autenticación
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirigir al login guardando la URL intentada
  router.navigate(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};

/**
 * Guard que protege rutas solo para administradores
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.hasRole('admin')) {
    return true;
  }

  // Redirigir al dashboard si no es admin
  router.navigate(['/dashboard/default']);
  return false;
};

/**
 * Guard que protege rutas para admin y manager
 */
export const managerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated() && authService.isAdminOrManager()) {
    return true;
  }

  // Redirigir al dashboard si no es admin/manager
  router.navigate(['/dashboard/default']);
  return false;
};
