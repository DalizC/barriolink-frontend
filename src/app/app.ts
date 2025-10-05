// filepath: src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],  // 👈 Esto permite usar <router-outlet>
  template: `
    <div class="header">
      <a routerLink="/">🏠 Inicio</a> |
      <a routerLink="/noticias">📰 Noticias</a> |
      <a routerLink="/eventos">📅 Eventos</a> |
      <a routerLink="/proyectos">📌 Proyectos</a> |
      <a routerLink="/certificados">📄 Certificados</a> |
      <a routerLink="/admin">⚙️ Admin</a>
    </div>
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}
