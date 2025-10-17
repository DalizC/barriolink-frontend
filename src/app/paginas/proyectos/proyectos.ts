import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card">
      <h2>Proyectos en curso</h2>
      <ul>
        <li *ngFor="let p of proyectos">{{ p.nombre }} — {{ p.estado }}</li>
      </ul>
    </div>

    <div class="card">
      <h2>💡 Proponer una nueva idea de proyecto</h2>
      <p>Envía tu propuesta al Directorio de la Junta de Vecinos.</p>

      <form (ngSubmit)="enviarIdea()" #ideaForm="ngForm">
        <label>Nombre del vecino:</label>
        <input
          type="text"
          name="nombre"
          [(ngModel)]="nombre"
          placeholder="Tu nombre completo"
          required
        />

        <label>Título del proyecto:</label>
        <input
          type="text"
          name="titulo"
          [(ngModel)]="titulo"
          placeholder="Ej: Mejoramiento de la plaza"
          required
        />

        <label>Descripción:</label>
        <textarea
          name="descripcion"
          [(ngModel)]="descripcion"
          placeholder="Explica tu idea y sus beneficios..."
          rows="4"
          required
        ></textarea>

        <label>Categoría:</label>
        <select name="categoria" [(ngModel)]="categoria" required>
          <option value="infraestructura">Infraestructura</option>
          <option value="medio_ambiente">Medio ambiente</option>
          <option value="seguridad">Seguridad vecinal</option>
          <option value="actividad_social">Actividad social</option>
          <option value="otro">Otro</option>
        </select>

        <button
          type="submit"
          class="button"
          [disabled]="!ideaForm.form.valid"
        >
          Enviar idea
        </button>
      </form>

      <div *ngIf="enviado" class="mensaje">
        ✅ ¡Tu idea fue enviada con éxito al Directorio!  
        <br />
        <small>Gracias por contribuir a tu comunidad.</small>
      </div>
    </div>
  `,
  styleUrls: ['./proyectos.css']
})
export class ProyectosComponent {
  proyectos = [
    { id: 1, nombre: 'Mejoramiento de áreas verdes', estado: 'En ejecución' },
    { id: 2, nombre: 'Nueva sede vecinal', estado: 'Pendiente' },
  ];

  nombre = '';
  titulo = '';
  descripcion = '';
  categoria = 'infraestructura';
  enviado = false;

  enviarIdea() {
    if (this.nombre && this.titulo && this.descripcion) {
      alert(
        `Idea enviada:\n\nTítulo: ${this.titulo}\nCategoría: ${this.categoria}\nPor: ${this.nombre}`
      );
      this.enviado = true;
      this.nombre = '';
      this.titulo = '';
      this.descripcion = '';
      this.categoria = 'infraestructura';
    }
  }
}
