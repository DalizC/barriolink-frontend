import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Reserva {
  tipo: string;
  fecha: string;
  hora: string;
  nombre: string;
}

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservas.html',
  styleUrls: ['./reservas.css']
})
export class ReservasComponent implements OnInit {
  reservaForm!: FormGroup;
  reservas: Reserva[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.reservaForm = this.fb.group({
      tipo: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      nombre: ['', Validators.required],
    });

    // cargar reservas desde localStorage
    const data = localStorage.getItem('reservas');
    if (data) {
      this.reservas = JSON.parse(data);
    }
  }

  reservar() {
    if (this.reservaForm.valid) {
      const nuevaReserva: Reserva = this.reservaForm.value;

      this.reservas.push(nuevaReserva);
      localStorage.setItem('reservas', JSON.stringify(this.reservas));

      alert('Reserva realizada con éxito 🎉');
      this.reservaForm.reset();
    }
  }
}
