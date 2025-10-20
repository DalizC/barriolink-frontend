import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";

@Component({
  selector: "app-events",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./events.html",
  styleUrl: "./events.scss",
})
export class Events {
  events = [
    { id: 1, title: "Reunión Vecinal", description: "Reunión mensual del barrio", date: "2024-10-25", time: "19:00", location: "Plaza Central", category: "Comunitario" },
    { id: 2, title: "Feria de Servicios", description: "Muestra de servicios locales", date: "2024-11-05", time: "10:00", location: "Centro Comunitario", category: "Comercial" },
    { id: 3, title: "Limpieza del Parque", description: "Jornada de limpieza voluntaria", date: "2024-10-30", time: "08:00", location: "Parque Barrial", category: "Voluntariado" },
  ];
}