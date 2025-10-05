import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-eventos',
  template: `
    <div class="card">
      <h2>Calendario de eventos</h2>
      <div *ngFor="let e of eventos" style="margin-bottom:8px">
        <strong>{{e.fecha}}</strong> — {{e.titulo}}
      </div>
    </div>
  `
})
export class EventosComponent {
  eventos = [
    { id: 1, fecha: '2025-09-30', titulo: 'Asamblea general' },
    { id: 2, fecha: '2025-10-05', titulo: 'Torneo de baby fútbol' }
  ];
}
