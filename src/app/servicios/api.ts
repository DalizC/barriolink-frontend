// filepath: src/app/servicios/api.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // vecinos
  private vecinos = [
    { id: 1, nombre: 'Juan Pérez', direccion: 'Calle 123' },
    { id: 2, nombre: 'María González', direccion: 'Av. Central 45' }
  ];

  // solicitudes
  private solicitudes = [
    { id: 1, vecino: 'Juan Pérez', tipo: 'Certificado de residencia', estado: 'Pendiente' },
    { id: 2, vecino: 'María González', tipo: 'Reparación luminaria', estado: 'En Proceso' }
  ];

  // notificaciones
  private notificaciones = [
    { id: 1, mensaje: 'Reunión vecinal el viernes a las 18:00', fecha: '2025-09-17' },
    { id: 2, mensaje: 'Nueva solicitud de Juan Pérez', fecha: '2025-09-16' }
  ];

  // ==== Métodos ====

  getVecinos() {
    return this.vecinos;
  }

  getSolicitudes() {
    return this.solicitudes;
  }

  getNotificaciones() {
    return this.notificaciones;
  }

  agregarSolicitud(vecino: string, tipo: string) {
    const nueva = {
      id: this.solicitudes.length + 1,
      vecino,
      tipo,
      estado: 'Pendiente'
    };
    this.solicitudes.push(nueva);

    // Crear notificación automática
    this.notificaciones.push({
      id: this.notificaciones.length + 1,
      mensaje: `Nueva solicitud de ${vecino}`,
      fecha: new Date().toISOString().split('T')[0]
    });

    return nueva;
  }

  actualizarEstadoSolicitud(id: number, nuevoEstado: string) {
    const solicitud = this.solicitudes.find(s => s.id === id);
    if (solicitud) solicitud.estado = nuevoEstado;
  }
}
