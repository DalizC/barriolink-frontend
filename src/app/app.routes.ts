import { Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login';
import { NoticiasComponent } from './paginas/noticias/noticias';
import { EventosComponent } from './paginas/eventos/eventos';
import { VecinoComponent } from './admin/vecinos/vecinos';
import { AdminPanelComponent } from './admin/panel/panel';
import { ProyectosComponent } from './paginas/proyectos/proyectos';
import { CertificadosComponent } from './paginas/certificados/certificados';
import { ReservasComponent } from './paginas/reservas/reservas';

import { authRoleGuard } from './guards/guards';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },

  // rutas accesibles a cualquier usuario logeado
  { path: 'noticias', component: NoticiasComponent, canActivate: [authRoleGuard] },
  { path: 'eventos', component: EventosComponent, canActivate: [authRoleGuard] },
  { path: 'proyectos', component: ProyectosComponent, canActivate: [authRoleGuard] },
  { path: 'certificados', component: CertificadosComponent, canActivate: [authRoleGuard] },
  { path: 'reservas', component: ReservasComponent, canActivate: [authRoleGuard], data: { role: 'vecino' } },


  // rutas exclusivas por rol
  { path: 'vecino', component: VecinoComponent, canActivate: [authRoleGuard], data: { role: 'vecino' } },
  { path: 'admin', component: AdminPanelComponent, canActivate: [authRoleGuard], data: { role: 'admin' } },

  // ruta por defecto
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }
];
