import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-solicitudes',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h3>Solicitudes pendientes</h3>
      <p *ngIf="solicitudes.length === 0"><small>No hay solicitudes</small></p>
      <div *ngFor="let s of solicitudes" style="margin:8px 0">
        <strong>{{s.tipo}}</strong> — {{s.nombre}}
        <div>
          <button class="button" (click)="resolver(s.id, true)">Aprobar</button>
          <button (click)="resolver(s.id, false)">Rechazar</button>
        </div>
      </div>
    </div>
  `
})
export class SolicitudesComponent {
  solicitudes = [
    { id: 1, tipo: 'Certificado', nombre: 'Juan Pérez' },
    { id: 2, tipo: 'Evento', nombre: 'Reserva cancha' }
  ];

  resolver(id: number, ok: boolean) {
    this.solicitudes = this.solicitudes.filter(s => s.id !== id);
    alert(ok ? 'Solicitud aprobada' : 'Solicitud rechazada');
  }
}
