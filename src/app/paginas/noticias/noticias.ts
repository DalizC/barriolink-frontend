import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h2>Noticias</h2>
      <article *ngFor="let n of noticias" style="margin-bottom:12px">
        <h4>{{n.titulo}}</h4>
        <p><small>{{n.cuerpo}}</small></p>
      </article>
    </div>
  `
})
export class NoticiasComponent {
  noticias = [
    { id: 1, titulo: 'Reparación de veredas', cuerpo: 'Se informa que el día 25 se inicia la reparación.' },
    { id: 2, titulo: 'Asamblea general', cuerpo: 'Asamblea abierta el 30 de septiembre a las 18:00.' }
  ];
}
