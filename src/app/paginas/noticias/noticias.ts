import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './noticias.html',
  styleUrls: ['./noticias.css']
})
export class NoticiasComponent {
  esAdmin = true; // Cambiar a false para ocultar el formulario a usuarios normales

  noticias = [
    { id: 1, titulo: 'Reparación de veredas', cuerpo: 'Se informa que el día 25 se inicia la reparación.' },
    { id: 2, titulo: 'Asamblea general', cuerpo: 'Asamblea abierta el 30 de septiembre a las 18:00.' }
  ];

  nuevaNoticia = { titulo: '', cuerpo: '' };
  enviado = false;

  agregarNoticia() {
    if (this.nuevaNoticia.titulo && this.nuevaNoticia.cuerpo) {
      this.noticias.push({
        id: this.noticias.length + 1,
        titulo: this.nuevaNoticia.titulo,
        cuerpo: this.nuevaNoticia.cuerpo
      });
      this.enviado = true;
      this.nuevaNoticia = { titulo: '', cuerpo: '' };
      setTimeout(() => this.enviado = false, 3000);
    } else {
      alert('Por favor completa todos los campos');
    }
  }
}
