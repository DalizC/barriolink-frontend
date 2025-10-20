import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-reservations-manage",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./reservations.html",
  styleUrl: "./reservations.scss",
})
export class ReservationsManage {
  reservations = [
    { id: 1, space: "Salón Comunitario", requester: "Ana Martínez", date: "2024-10-25", time: "18:00-22:00", purpose: "Cumpleaños", status: "Aprobada" },
    { id: 2, space: "Cancha de Fútbol", requester: "Club Deportivo", date: "2024-10-27", time: "15:00-17:00", purpose: "Entrenamiento", status: "Pendiente" },
    { id: 3, space: "Sala de Reuniones", requester: "Junta de Vecinos", date: "2024-10-30", time: "19:00-21:00", purpose: "Reunión Mensual", status: "Aprobada" },
  ];
}