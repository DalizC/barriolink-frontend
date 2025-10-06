import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';   // 👈 IMPORTANTE
import { CommonModule } from '@angular/common'; // 👈 Para *ngFor, *ngIf
import { ApiService } from '../../servicios/api';

@Component({
  selector: 'app-vecino',
  standalone: true, // 👈 si lo estás usando como componente independiente
  imports: [FormsModule, CommonModule], // 👈 agrega esto
  templateUrl: './vecinos.html',
  styleUrls: ['./vecinos.css']
})
export class VecinoComponent {
  solicitudes: any[] = [];
  nuevoTipo: string = '';

  constructor(private api: ApiService) {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.solicitudes = this.api.getSolicitudes();
  }

  generarSolicitud() {
    if (!this.nuevoTipo.trim()) return;

    this.api.agregarSolicitud('Juan Pérez', this.nuevoTipo);
    this.nuevoTipo = '';

    this.cargarSolicitudes(); // refresca la lista
  }
}
