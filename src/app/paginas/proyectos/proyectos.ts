import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-proyectos',
  template: `
    <div class="card">
      <h2>Proyectos en curso</h2>
      <ul>
        <li *ngFor="let p of proyectos">{{p.nombre}} — {{p.estado}}</li>
      </ul>
    </div>
  `
})
export class ProyectosComponent {
  proyectos = [
    { id: 1, nombre: 'Mejoramiento de áreas verdes', estado: 'En ejecución' },
    { id: 2, nombre: 'Nueva sede vecinal', estado: 'Pendiente' }
  ];
}
