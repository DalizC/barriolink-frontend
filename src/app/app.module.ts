// filepath: src/app/app.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './paginas/login/login';
import { NoticiasComponent } from './paginas/noticias/noticias';
import { EventosComponent } from './paginas/eventos/eventos';
import { AdminPanelComponent } from './admin/panel/panel';

export const appRoutes: Routes = [
  { path: '', component: LoginComponent },         // Página inicial
  { path: 'noticias', component: NoticiasComponent },
  { path: 'eventos', component: EventosComponent },
  { path: 'admin', component: AdminPanelComponent },
  { path: '**', redirectTo: '' }
];
