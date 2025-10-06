import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';   // 👈 Importar
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notificaciones',
  standalone: true,                            // 👈 Importante
  imports: [CommonModule, FormsModule],        // 👈 Se importa FormsModule aquí
  template: `
    <div class="card">
      <h3>Enviar notificación</h3>
      <form (ngSubmit)="enviar()">
        <textarea rows="4"
                  [(ngModel)]="mensaje"
                  name="mensaje"
                  placeholder="Escribe tu mensaje"
                  required></textarea>

        <select [(ngModel)]="canal" name="canal">
          <option value="afiche">Afiche</option>
          <option value="email">Email</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        <button type="submit" class="button">Enviar</button>
      </form>
    </div>
  `
})
export class NotificacionesComponent {
  mensaje = '';
  canal = 'afiche';

  enviar() {
    alert(`Notificación enviada por ${this.canal}: ${this.mensaje}`);
    this.mensaje = '';
    this.canal = 'afiche';
  }
}
