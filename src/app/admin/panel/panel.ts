// filepath: src/app/admin/panel/panel.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';   // 👈 importar FormsModule
import { ApiService } from '../../servicios/api';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],  // 👈 agregar FormsModule aquí
  templateUrl: './panel.html',
  styleUrls: ['./panel.css']
})
export class AdminPanelComponent {
  vecinos: any[] = [];
  solicitudes: any[] = [];
  notificaciones: any[] = [];

  constructor(private api: ApiService) {
    this.vecinos = this.api.getVecinos();
    this.solicitudes = this.api.getSolicitudes();
    this.notificaciones = this.api.getNotificaciones();
  }

  cambiarEstado(id: number, nuevoEstado: string) {
    this.api.actualizarEstadoSolicitud(id, nuevoEstado);
    this.solicitudes = this.api.getSolicitudes(); // 👈 refresca la lista después de cambiar
  }
}
