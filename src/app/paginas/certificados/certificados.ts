import { Component } from '@angular/core';

@Component({
  selector: 'app-certificados',
  template: `
    <div class="card">
      <h2>Solicitud de certificados</h2>
      <form (submit)="enviar()">
        <input type="text" [value]="nombre" (input)="nombre = $event.target.value" name="nombre" placeholder="Nombre completo" required />
        <select #tipoSelect (change)="tipo = tipoSelect.value" name="tipo">
          <option value="residencia">Residencia</option>
          <option value="buen_conducta">Buen comportamiento</option>
        </select>
        <button type="submit" class="button">Solicitar</button>
      </form>
    </div>
  `
})
export class CertificadosComponent {
  nombre = '';
  tipo = 'residencia';

  enviar() {
    alert(`Certificado solicitado: ${this.tipo} para ${this.nombre}`);
    this.nombre = '';
    this.tipo = 'residencia';
  }
}
