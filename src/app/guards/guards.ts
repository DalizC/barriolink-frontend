import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export const authRoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // Solo en navegador
  if (!isPlatformBrowser(platformId)) return false;

  const user = localStorage.getItem('user');
  const rol = localStorage.getItem('rol');

  // Si no hay sesión → login
  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  // Si la ruta tiene rol definido
  const expectedRole = route.data?.['role'] as string | undefined;
  if (expectedRole && rol !== expectedRole) {
    // Redirigir según rol existente
    if (rol === 'admin') router.navigate(['/admin']);
    else if (rol === 'vecino') router.navigate(['/noticias']);
    else router.navigate(['/login']);
    return false;
  }

  // Usuario logeado y autorizado
  return true;
};
